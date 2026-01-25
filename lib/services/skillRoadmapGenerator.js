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
Create a comprehensive day-by-day learning roadmap for the skill below, tailored to the target role.
Return ONLY valid JSON (no markdown, no code fences).

Skill: ${skill}
Target Role: ${role || 'Software Engineer'}
Days: ${safeDays}

CRITICAL INSTRUCTION:
You MUST cover the ENTIRE core curriculum for ${skill} within the given ${safeDays} days.
- If Days is 1: Compress ALL major topics (Foundations, Core, Advanced) into this single day.
- If Days is small (e.g. 2-5): Distribute all topics densely across these days.
- If Days is large (e.g. 30+): Spread the topics out with more practice time.
- Do NOT omit essential topics just because the time is short. Adjust the density, not the scope.

Resources (use these when helpful):
- Best course: ${resourcePack.best_course?.name || 'N/A'} (${resourcePack.best_course?.url || 'N/A'})
- Documentation: ${resourcePack.documentation?.name || 'N/A'} (${resourcePack.documentation?.url || 'N/A'})
- Handbook: ${resourcePack.handbook?.name || 'N/A'} (${resourcePack.handbook?.url || 'N/A'})
- Practice: ${resourcePack.practice?.name || 'N/A'} (${resourcePack.practice?.url || 'N/A'})

JSON schema:
{
  "summary": "<2-3 sentence summary explaining the pace>",
  "objectives": ["<objective 1>", "<objective 2>", "<objective 3>"],
  "prerequisites": ["<prereq 1>", "<prereq 2>"],
  "daily_plan": [
    {
      "day": 1,
      "title": "<theme for the day>",
      "focus": "<main concepts covered>",
      "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>", "<specific task 4>"]
    }
  ],
  "milestones": ["<milestone 1>", "<milestone 2>"]
}

Rules:
- daily_plan length MUST exactly equal ${safeDays}
- Each day MUST have at least 3-5 actionable tasks
- For short roadmaps, tasks should be very specific high-level overviews or rapid-fire concepts`;

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

    _getTopicList(skill) {
        // Detailed curricula for common skills to ensure "100 topics" feel
        const commonCurricula = {
            'python': [
                'Variables & Data Types', 'Control Flow (if/else)', 'Loops (for/while)', 'Functions & Scope', 'Lists & Tuples',
                'Dictionaries & Sets', 'File I/O', 'Exception Handling', 'Modules & Packages', 'Virtual Environments',
                'OOP: Classes & Objects', 'OOP: Inheritance', 'OOP: Polymorphism', 'List Comprehensions', 'Lambda Functions',
                'Decorators', 'Generators', 'Regular Expressions', 'Pip & Dependency Management', 'Debugging Techniques',
                'Unit Testing (unittest/pytest)', 'Working with JSON', 'API Requests (requests)', 'Web Scraping Basics', 'Pandas Basics',
                'NumPy Basics', 'Data Visualization (Matplotlib)', 'SQL with Python', 'Flask/Django Basics', 'REST API Concepts',
                'Asynchronous Python (asyncio)', 'Type Hinting', 'Context Managers', 'Multi-threading', 'Deployment Basics'
            ],
            'javascript': [
                'Variables (let/const)', 'Data Types & Coercion', 'Functions & Arrow Functions', 'Arrays & Methods', 'Objects & Destructuring',
                'Spread/Rest Operators', 'Template Literals', 'Control Flow', 'Loops & Iteration', 'DOM Manipulation',
                'Event Handling', 'Asynchronous JS (Callbacks)', 'Promises', 'Async/Await', 'Fetch API',
                'ES6+ Modules', 'Classes & Prototypes', 'Error Handling', 'Local Storage', 'JSON Handling',
                'Closures & Scope', 'Hoisting', 'This Keyword', 'Event Loop & Concurrency', 'Browser APIs',
                'Form Validation', 'Web Workers', 'Service Workers', 'Webpack/Babel Basics', 'TypeScript Basics',
                'Node.js Intro', 'NPM/Yarn', 'Unit Testing (Jest)', 'React/Vue/Angular Intro', 'Deployment'
            ],
            'react': [
                'JSX Syntax', 'Components (Functional/Class)', 'Props & PropTypes', 'State (useState)', 'Events Handling',
                'Effect Hook (useEffect)', 'Conditional Rendering', 'Lists & Keys', 'Forms & Inputs', 'Component Lifecycle',
                'Context API', 'useReducer Hook', 'Custom Hooks', 'useRef & DOM', 'React Router',
                'State Management (Redux/Zustand)', 'API Integration', 'Styling (CSS/SASS/Tailwind)', 'Styled Components', 'Performance Optimization',
                'useMemo & useCallback', 'React.memo', 'Code Splitting (Lazy/Suspense)', 'Error Boundaries', 'Portals',
                'Higher Order Components', 'Render Props', 'Testing (React Testing Library)', 'Next.js Basics', 'Server Side Rendering',
                'Static Site Generation', 'React Query / SWR', 'Framer Motion', 'Accessibility (A11y)', 'Deployment (Vercel/Netlify)'
            ],
            'sql': [
                'SELECT & FROM', 'WHERE Filtering', 'AND/OR/NOT', 'ORDER BY', 'LIMIT/OFFSET',
                'MIN/MAX/COUNT', 'SUM/AVG', 'GROUP BY', 'HAVING', 'Distinct',
                'INNER JOIN', 'LEFT/RIGHT JOIN', 'FULL OUTER JOIN', 'Self Joins', 'UNION & UNION ALL',
                'CASE Statements', 'NULL Handling', 'String Functions', 'Date/Time Functions', 'Numeric Functions',
                'Subqueries (WHERE)', 'Subqueries (SELECT/FROM)', 'CTE (Common Table Expressions)', 'INSERT INTO', 'UPDATE',
                'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP/TRUNCATE', 'Constraints (PK/FK)',
                'Indexes & Performance', 'Views', 'Stored Procedures', 'Triggers', 'Transactions (ACID)',
                'Normalization', 'Window Functions (RANK)', 'Window Functions (LEAD/LAG)', 'Database Design', 'NoSQL Comparisons'
            ],
            'java': [
                'Variables & Types', 'Operators', 'Control Structures', 'Loops', 'Arrays',
                'Methods', 'Classes & Objects', 'Constructors', 'Inheritance', 'Polymorphism',
                'Encapsulation', 'Abstraction', 'Interfaces', 'Abstract Classes', 'Static Keyword',
                'Final Keyword', 'Packages', 'Access Modifiers', 'Exception Handling', 'File I/O',
                'Collections: List', 'Collections: Set', 'Collections: Map', 'Generics', 'Lambdas',
                'Streams API', 'Optional Class', 'Date & Time API', 'Multithreading', 'Synchronization',
                'JDBC (Database)', 'Maven/Gradle', 'Unit Testing (JUnit)', 'Spring Boot Basics', 'REST APIs'
            ]
        };

        const key = skill.toLowerCase();
        // Return refined list if available, else a generic "100 topics" style generated list
        if (commonCurricula[key]) return commonCurricula[key];

        // Fallback for unknown skills - generate generic but structured topics
        const genericPhases = [
            'Core Concepts', 'Syntax & Structure', 'Basic Operations', 'Advanced Features', 'Best Practices',
            'Tooling & Ecosystem', 'Performance Tuning', 'Debugging', 'Testing Strategies', 'Real-world Application'
        ];

        return genericPhases.flatMap(phase => [
            `${phase}: Intro`, `${phase}: Deep Dive`, `${phase}: Practice`, `${phase}: Advanced Cases`
        ]);
    }

    _getFallbackRoadmap({ skill, days, role, resourcePack }) {
        // 1. Get the full curriculum (the "100 topics")
        const allTopics = this._getTopicList(skill);

        // 2. Divide topics by days
        // If we have 40 topics and 10 days, we need 4 topics per day.
        // If we have 40 topics and 1 day, we need 40 topics that day.
        const totalTopics = allTopics.length;
        const topicsPerDay = Math.ceil(totalTopics / days);

        const daily_plan = Array.from({ length: days }, (_, i) => {
            const dayNum = i + 1;
            const startIdx = i * topicsPerDay;
            // Ensure we don't go out of bounds, but also ensure we don't end up with empty days if math is weird.
            // Actually with ceil, the last day might have fewer tasks, which is fine.
            const endIdx = Math.min(startIdx + topicsPerDay, totalTopics);

            // If we ran out of topics (e.g. days > topics), we cycle or add review
            const dayTopics = (startIdx < totalTopics)
                ? allTopics.slice(startIdx, endIdx)
                : [`Review & Practice: ${allTopics[(i) % allTopics.length]}`];


            return {
                day: dayNum,
                title: dayTopics.length > 0 ? dayTopics[0] : `Day ${dayNum} Practice`,
                focus: dayTopics.length > 0 ? `Covering ${dayTopics.length} topics starting with ${dayTopics[0]}` : "Consolidation & Review",
                tasks: dayTopics.length > 0 ? dayTopics.map(t => `Learn: ${t}`) : ["Review previous concepts", "Build a small project"]
            };
        });

        return {
            success: true,
            data: {
                skill,
                role: role || 'Software Engineer',
                days,
                summary: `A comprehensive ${days}-day plan covering ${totalTopics} key topics in ${skill}. Paced at ~${topicsPerDay} topics per day.`,
                objectives: [
                    `Master ${totalTopics} core concepts of ${skill}`,
                    `Complete daily focused learning modules`,
                    'Apply knowledge comprehensively'
                ],
                prerequisites: ['Basic computer literacy', 'Dedication to daily study'],
                daily_plan,
                milestones: [
                    `Complete first ${Math.ceil(days / 3)} days`,
                    `Mid-point review (Day ${Math.ceil(days / 2)})`,
                    'Final curriculum completion'
                ],
                resources: resourcePack,
            },
        };
    }
}

export default SkillRoadmapGenerator;
