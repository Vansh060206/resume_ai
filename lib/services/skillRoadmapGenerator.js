/**
 * Skill Roadmap Generator
 * Creates a day-by-day plan for a specific skill.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import RoadmapGenerator from './roadmapGenerator';

const MAX_DAYS = 60;

class SkillRoadmapGenerator {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            console.warn('⚠️ GEMINI_API_KEY not configured properly. Using fallback roadmap.');
            this.genAI = null;
            this.model = null;
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        }
    }

    async generateSkillRoadmap({ skill, days, role }) {
        const normalizedDays = Number.isFinite(days) ? days : Number.parseInt(days, 10);
        const safeDays = Math.min(Math.max(normalizedDays || 0, 1), MAX_DAYS);

        const resourcePack = this._getResourcePack(skill);
        if (!this.model) {
            return this._getFallbackRoadmap({ skill, days: safeDays, role, resourcePack });
        }

        const prompt = `You are a senior engineering mentor and curriculum designer.
Create a day-by-day learning roadmap for the skill below, tailored to the target role.
Return ONLY valid JSON (no markdown, no code fences).

Skill: ${skill}
Target Role: ${role || 'Software Engineer'}
Days: ${safeDays}

Resources (use these when helpful):
- Best course: ${resourcePack.best_course?.name || 'N/A'} (${resourcePack.best_course?.url || 'N/A'})
- Documentation: ${resourcePack.documentation?.name || 'N/A'} (${resourcePack.documentation?.url || 'N/A'})
- Handbook: ${resourcePack.handbook?.name || 'N/A'} (${resourcePack.handbook?.url || 'N/A'})
- Practice: ${resourcePack.practice?.name || 'N/A'} (${resourcePack.practice?.url || 'N/A'})

JSON schema:
{
  "summary": "<2-3 sentence summary>",
  "objectives": ["<objective 1>", "<objective 2>", "<objective 3>"],
  "prerequisites": ["<prereq 1>", "<prereq 2>"],
  "daily_plan": [
    {
      "day": 1,
      "title": "<short theme>",
      "focus": "<what to learn>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"]
    }
  ],
  "milestones": ["<milestone 1>", "<milestone 2>"]
}

Rules:
- daily_plan length MUST equal ${safeDays}
- Use concise, actionable tasks
- Keep objectives and milestones realistic for ${safeDays} days`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let resultText = response.text().trim();

            if (resultText.startsWith('```')) {
                const parts = resultText.split('```');
                resultText = parts[1];
                if (resultText.startsWith('json')) {
                    resultText = resultText.substring(4);
                }
                resultText = resultText.trim();
            }

            const roadmap = JSON.parse(resultText);
            if (!Array.isArray(roadmap.daily_plan)) {
                throw new Error('Invalid roadmap format');
            }

            return {
                success: true,
                data: {
                    skill,
                    role: role || 'Software Engineer',
                    days: safeDays,
                    summary: roadmap.summary || `Roadmap for ${skill}`,
                    objectives: roadmap.objectives || [],
                    prerequisites: roadmap.prerequisites || [],
                    daily_plan: roadmap.daily_plan.slice(0, safeDays),
                    milestones: roadmap.milestones || [],
                    resources: resourcePack,
                },
            };
        } catch (error) {
            console.error('❌ Skill Roadmap AI error:', error.message);
            return this._getFallbackRoadmap({ skill, days: safeDays, role, resourcePack });
        }
    }

    _getResourcePack(skill) {
        const resource = RoadmapGenerator.SKILL_RESOURCES?.[skill];
        if (resource) {
            const { best_course, documentation, handbook, practice } = resource;
            return { best_course, documentation, handbook, practice };
        }

        return {
            best_course: { name: `Best ${skill} Course`, url: 'https://www.udemy.com/', source: 'Udemy', type: 'Paid' },
            documentation: { name: `${skill} Official Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' documentation')}`, source: 'Docs', type: 'Free' },
            handbook: { name: `${skill} Handbook / Guide`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' handbook')}`, source: 'Handbook', type: 'Free' },
            practice: { name: `Practice ${skill}`, url: `https://www.google.com/search?q=${encodeURIComponent('learn ' + skill)}`, source: 'Web', type: 'Free' },
        };
    }

    _getFallbackRoadmap({ skill, days, role, resourcePack }) {
        const phases = [
            { title: 'Foundations', focus: `Understand ${skill} basics and terminology`, tasks: ['Review core concepts', 'Read official docs', 'Take notes'] },
            { title: 'Core Skills', focus: `Practice core ${skill} features`, tasks: ['Build small exercises', 'Follow guided tutorials', 'Solve small challenges'] },
            { title: 'Applied Learning', focus: `Apply ${skill} to realistic scenarios`, tasks: ['Create a mini project', 'Refactor for best practices', 'Add tests or checks'] },
            { title: 'Project & Review', focus: `Build a portfolio-ready project`, tasks: ['Plan final project', 'Implement key features', 'Review and summarize learnings'] },
        ];

        const chunkSize = Math.ceil(days / phases.length);
        const daily_plan = Array.from({ length: days }, (_, idx) => {
            const phaseIndex = Math.min(Math.floor(idx / chunkSize), phases.length - 1);
            const phase = phases[phaseIndex];
            return {
                day: idx + 1,
                title: phase.title,
                focus: phase.focus,
                tasks: phase.tasks,
            };
        });

        return {
            success: true,
            data: {
                skill,
                role: role || 'Software Engineer',
                days,
                summary: `A ${days}-day learning plan for ${skill}, focused on practical mastery for ${role || 'Software Engineer'} roles.`,
                objectives: [
                    `Gain foundational understanding of ${skill}`,
                    `Build hands-on experience through practice tasks`,
                    'Deliver a small project demonstrating competency',
                ],
                prerequisites: ['Basic programming knowledge', 'Willingness to practice daily'],
                daily_plan,
                milestones: ['Finish core concepts', 'Complete a guided project', 'Ship a small capstone project'],
                resources: resourcePack,
            },
        };
    }
}

export default SkillRoadmapGenerator;
