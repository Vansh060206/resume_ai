/**
 * Learning Roadmap Generator
 * Creates personalized skill development roadmaps with 4 resources per skill:
 * 1. Best Course | 2. Documentation Website | 3. Handbook | 4. Practice/Concepts Website
 */

class RoadmapGenerator {
    // Each skill: best_course, documentation, handbook, practice (4 options)
    static SKILL_RESOURCES = {
        Python: {
            time: '3-4 months',
            priority: 'High',
            difficulty: 'Beginner',
            description: 'Master Python fundamentals, data structures, and modern syntax for building scalable applications.',
            best_course: { name: 'Python for Everybody (Coursera)', url: 'https://www.coursera.org/specializations/python', source: 'Coursera', type: 'Free' },
            documentation: { name: 'Python.org Official Tutorial', url: 'https://docs.python.org/3/tutorial/', source: 'Python Docs', type: 'Free' },
            handbook: { name: 'The Python Handbook', url: 'https://www.freecodecamp.org/news/the-python-handbook/', source: 'freeCodeCamp', type: 'Free' },
            practice: { name: 'Real Python – Tutorials', url: 'https://realpython.com/', source: 'Real Python', type: 'Free' },
        },
        JavaScript: {
            time: '2-3 months',
            priority: 'High',
            difficulty: 'Beginner',
            description: 'Learn modern JavaScript ES6+ for web development, async programming, and DOM manipulation.',
            best_course: { name: 'JavaScript: The Complete Guide (Udemy)', url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'JavaScript.info – The Modern Tutorial', url: 'https://javascript.info/', source: 'JavaScript.info', type: 'Free' },
            handbook: { name: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', source: 'Online Book', type: 'Free' },
            practice: { name: 'freeCodeCamp JavaScript', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', source: 'freeCodeCamp', type: 'Free' },
        },
        TypeScript: {
            time: '2-3 months',
            priority: 'High',
            difficulty: 'Intermediate',
            description: 'Master TypeScript for type-safe, scalable JavaScript applications.',
            best_course: { name: 'Understanding TypeScript (Udemy)', url: 'https://www.udemy.com/course/understanding-typescript/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', source: 'TypeScript Docs', type: 'Free' },
            handbook: { name: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript/', source: 'GitBook', type: 'Free' },
            practice: { name: 'TypeScript Exercises', url: 'https://typescript-exercises.github.io/', source: 'TypeScript Exercises', type: 'Free' },
        },
        React: {
            time: '2-3 months',
            priority: 'High',
            difficulty: 'Intermediate',
            description: 'Build dynamic, responsive web applications with React, including hooks, context, and state management.',
            best_course: { name: 'React – The Complete Guide (Udemy)', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'React Official Documentation', url: 'https://react.dev/', source: 'React Docs', type: 'Free' },
            handbook: { name: 'React TypeScript Cheatsheet', url: 'https://react-typescript-cheatsheet.netlify.app/', source: 'Cheatsheet', type: 'Free' },
            practice: { name: 'React Tutorial – Tic-Tac-Toe', url: 'https://react.dev/learn/tutorial-tic-tac-toe', source: 'React Learn', type: 'Free' },
        },
        'Node.js': {
            time: '2-3 months',
            priority: 'High',
            difficulty: 'Intermediate',
            description: 'Build scalable backend services and APIs with Node.js and the npm ecosystem.',
            best_course: { name: 'The Complete Node.js Developer Course (Udemy)', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'Node.js Official Documentation', url: 'https://nodejs.org/docs/latest/api/', source: 'Node.js Docs', type: 'Free' },
            handbook: { name: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', source: 'GitHub', type: 'Free' },
            practice: { name: 'NodeSchool Workshops', url: 'https://nodeschool.io/', source: 'NodeSchool', type: 'Free' },
        },
        Docker: {
            time: '1-2 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Containerize applications with Docker for consistent deployment across environments.',
            best_course: { name: 'Docker Mastery (Udemy)', url: 'https://www.udemy.com/course/docker-mastery/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'Docker Official Documentation', url: 'https://docs.docker.com/', source: 'Docker Docs', type: 'Free' },
            handbook: { name: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', source: 'Docker', type: 'Free' },
            practice: { name: 'Play with Docker', url: 'https://labs.play-with-docker.com/', source: 'PWD', type: 'Free' },
        },
        Kubernetes: {
            time: '2-3 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Orchestrate containers at scale with Kubernetes for production workloads.',
            best_course: { name: 'Kubernetes for Developers (LFD259)', url: 'https://training.linuxfoundation.org/training/kubernetes-for-developers/', source: 'Linux Foundation', type: 'Paid' },
            documentation: { name: 'Kubernetes Official Documentation', url: 'https://kubernetes.io/docs/home/', source: 'K8s Docs', type: 'Free' },
            handbook: { name: 'Kubernetes Handbook', url: 'https://kubernetes.io/docs/concepts/', source: 'K8s Concepts', type: 'Free' },
            practice: { name: 'Kubernetes Tutorials', url: 'https://kubernetes.io/docs/tutorials/', source: 'K8s Tutorials', type: 'Free' },
        },
        AWS: {
            time: '3-4 months',
            priority: 'High',
            difficulty: 'Intermediate',
            description: 'Design and deploy cloud solutions on AWS including EC2, S3, Lambda, and more.',
            best_course: { name: 'AWS Certified Solutions Architect (Udemy)', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', source: 'AWS Docs', type: 'Free' },
            handbook: { name: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', source: 'AWS', type: 'Free' },
            practice: { name: 'AWS Free Tier Hands-On', url: 'https://aws.amazon.com/free/', source: 'AWS Free Tier', type: 'Free' },
        },
        'Machine Learning': {
            time: '4-6 months',
            priority: 'High',
            difficulty: 'Advanced',
            description: 'Build ML models with Python, scikit-learn, and deep learning frameworks.',
            best_course: { name: 'Machine Learning by Andrew Ng (Coursera)', url: 'https://www.coursera.org/learn/machine-learning', source: 'Coursera', type: 'Free' },
            documentation: { name: 'Scikit-learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', source: 'Scikit-learn', type: 'Free' },
            handbook: { name: 'Hands-On Machine Learning (O\'Reilly)', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', source: 'O\'Reilly', type: 'Paid' },
            practice: { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', source: 'Kaggle', type: 'Free' },
        },
        SQL: {
            time: '1-2 months',
            priority: 'High',
            difficulty: 'Beginner',
            description: 'Query and manage relational databases with SQL for data analysis and backend development.',
            best_course: { name: 'SQL for Data Science (Coursera)', url: 'https://www.coursera.org/learn/sql-for-data-science', source: 'Coursera', type: 'Free' },
            documentation: { name: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', source: 'PostgreSQL', type: 'Free' },
            handbook: { name: 'SQLZoo Tutorial', url: 'https://sqlzoo.net/', source: 'SQLZoo', type: 'Free' },
            practice: { name: 'LeetCode Database', url: 'https://leetcode.com/problemset/database/', source: 'LeetCode', type: 'Free' },
        },
        Git: {
            time: '2-4 weeks',
            priority: 'High',
            difficulty: 'Beginner',
            description: 'Version control with Git: branching, merging, and collaborative workflows.',
            best_course: { name: 'Git & GitHub Crash Course (Udemy)', url: 'https://www.udemy.com/course/git-and-github-crash-course/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'Git Official Documentation', url: 'https://git-scm.com/doc', source: 'Git Docs', type: 'Free' },
            handbook: { name: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2', source: 'Pro Git', type: 'Free' },
            practice: { name: 'Learn Git Branching', url: 'https://learngitbranching.js.org/', source: 'Visual Git', type: 'Free' },
        },
        Angular: {
            time: '2-3 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Build enterprise Angular applications with TypeScript, RxJS, and Angular CLI.',
            best_course: { name: 'Angular – The Complete Guide (Udemy)', url: 'https://www.udemy.com/course/the-complete-guide-to-angular-2/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'Angular Documentation', url: 'https://angular.io/docs', source: 'Angular Docs', type: 'Free' },
            handbook: { name: 'Angular Style Guide', url: 'https://angular.io/guide/styleguide', source: 'Angular', type: 'Free' },
            practice: { name: 'Angular Tutorial Tour of Heroes', url: 'https://angular.io/tutorial', source: 'Angular', type: 'Free' },
        },
        Vue: {
            time: '2-3 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Create reactive UIs with Vue 3, Composition API, and Vue Router.',
            best_course: { name: 'Vue – The Complete Guide (Udemy)', url: 'https://www.udemy.com/course/vuejs-2-the-complete-guide/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'Vue.js Official Guide', url: 'https://vuejs.org/guide/introduction.html', source: 'Vue Docs', type: 'Free' },
            handbook: { name: 'Vue 3 Cheat Sheet', url: 'https://vuejs.org/guide/cheatsheet.html', source: 'Vue', type: 'Free' },
            practice: { name: 'Vue.js Examples', url: 'https://vuejs.org/examples/', source: 'Vue', type: 'Free' },
        },
        'Next.js': {
            time: '2-3 months',
            priority: 'High',
            difficulty: 'Intermediate',
            description: 'Build full-stack React applications with Next.js, SSR, and API routes.',
            best_course: { name: 'Next.js 14 – Full Course (YouTube)', url: 'https://www.youtube.com/results?search_query=nextjs+14+full+course', source: 'YouTube', type: 'Free' },
            documentation: { name: 'Next.js Documentation', url: 'https://nextjs.org/docs', source: 'Next.js Docs', type: 'Free' },
            handbook: { name: 'Next.js Learn', url: 'https://nextjs.org/learn', source: 'Next.js', type: 'Free' },
            practice: { name: 'Next.js Examples', url: 'https://github.com/vercel/next.js/tree/canary/examples', source: 'GitHub', type: 'Free' },
        },
        MongoDB: {
            time: '1-2 months',
            priority: 'Medium',
            difficulty: 'Beginner',
            description: 'Work with MongoDB and Mongoose for NoSQL data modeling and queries.',
            best_course: { name: 'MongoDB University', url: 'https://learn.mongodb.com/', source: 'MongoDB', type: 'Free' },
            documentation: { name: 'MongoDB Manual', url: 'https://www.mongodb.com/docs/manual/', source: 'MongoDB Docs', type: 'Free' },
            handbook: { name: 'MongoDB University – M001', url: 'https://learn.mongodb.com/courses/m001-mongodb-basics', source: 'MongoDB', type: 'Free' },
            practice: { name: 'MongoDB Atlas Free Tier', url: 'https://www.mongodb.com/cloud/atlas', source: 'MongoDB Atlas', type: 'Free' },
        },
        Terraform: {
            time: '1-2 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Infrastructure as Code with Terraform for cloud provisioning.',
            best_course: { name: 'Terraform Associate Certification (Udemy)', url: 'https://www.udemy.com/course/terraform-beginner-to-advanced/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'Terraform Documentation', url: 'https://developer.hashicorp.com/terraform/docs', source: 'HashiCorp', type: 'Free' },
            handbook: { name: 'Terraform Best Practices', url: 'https://www.terraform-best-practices.com/', source: 'Best Practices', type: 'Free' },
            practice: { name: 'Terraform Learn', url: 'https://developer.hashicorp.com/terraform/tutorials', source: 'HashiCorp', type: 'Free' },
        },
        'REST API': {
            time: '1-2 months',
            priority: 'High',
            difficulty: 'Intermediate',
            description: 'Design and build RESTful APIs with best practices and security.',
            best_course: { name: 'REST APIs with Flask and Python', url: 'https://www.udemy.com/course/rest-api-flask-and-python/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'REST API Tutorial', url: 'https://restfulapi.net/', source: 'REST API Tutorial', type: 'Free' },
            handbook: { name: 'API Design Handbook', url: 'https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/', source: 'freeCodeCamp', type: 'Free' },
            practice: { name: 'Postman Learning Center', url: 'https://learning.postman.com/', source: 'Postman', type: 'Free' },
        },
        GraphQL: {
            time: '1-2 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Build flexible APIs with GraphQL schemas, resolvers, and Apollo.',
            best_course: { name: 'GraphQL with React (Udemy)', url: 'https://www.udemy.com/course/graphql-with-react-course/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'GraphQL Official Documentation', url: 'https://graphql.org/learn/', source: 'GraphQL', type: 'Free' },
            handbook: { name: 'GraphQL Best Practices', url: 'https://graphql.org/learn/best-practices/', source: 'GraphQL', type: 'Free' },
            practice: { name: 'How to GraphQL', url: 'https://www.howtographql.com/', source: 'How to GraphQL', type: 'Free' },
        },
        'CI/CD': {
            time: '1-2 months',
            priority: 'Medium',
            difficulty: 'Intermediate',
            description: 'Automate build, test, and deployment pipelines with CI/CD tools.',
            best_course: { name: 'Jenkins, From Zero To Hero (Udemy)', url: 'https://www.udemy.com/course/jenkins-from-zero-to-hero/', source: 'Udemy', type: 'Paid' },
            documentation: { name: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', source: 'GitHub', type: 'Free' },
            handbook: { name: 'CI/CD Best Practices', url: 'https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment', source: 'Atlassian', type: 'Free' },
            practice: { name: 'GitHub Actions Tutorial', url: 'https://github.com/skills/github-actions', source: 'GitHub Skills', type: 'Free' },
        },
    };

    static generateRoadmap(suggestedSkills, detectedRole) {
        const roadmapItems = [];
        const seen = new Set();

        for (const skill of suggestedSkills.slice(0, 6)) {
            if (seen.has(skill)) continue;
            seen.add(skill);

            const skillInfo = this.SKILL_RESOURCES[skill] || {
                time: '2-3 months',
                priority: 'Medium',
                difficulty: 'Intermediate',
                description: `Master ${skill} to enhance your ${detectedRole} capabilities.`,
                best_course: { name: `Best ${skill} Course`, url: 'https://www.udemy.com/', source: 'Udemy', type: 'Paid' },
                documentation: { name: `${skill} Official Documentation`, url: 'https://www.google.com/search?q=' + encodeURIComponent(skill + ' documentation'), source: 'Docs', type: 'Free' },
                handbook: { name: `${skill} Handbook / Guide`, url: 'https://www.google.com/search?q=' + encodeURIComponent(skill + ' handbook'), source: 'Handbook', type: 'Free' },
                practice: { name: `Learn ${skill} – Practice`, url: 'https://www.google.com/search?q=' + encodeURIComponent('learn ' + skill), source: 'Web', type: 'Free' },
            };

            roadmapItems.push({
                skill,
                estimated_time: skillInfo.time,
                priority: skillInfo.priority,
                difficulty: skillInfo.difficulty,
                description: skillInfo.description,
                best_course: skillInfo.best_course,
                documentation: skillInfo.documentation,
                handbook: skillInfo.handbook,
                practice: skillInfo.practice,
            });
        }

        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        roadmapItems.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        const phases = this._createPhases(roadmapItems);
        const totalMonths = roadmapItems.length * 2;
        const total_estimated_time = totalMonths <= 6 ? '4-6 months' : totalMonths <= 9 ? '6-9 months' : '6-12 months';

        return {
            success: true,
            roadmap: roadmapItems,
            phases,
            total_estimated_time,
            total_time: total_estimated_time,
            role: detectedRole,
        };
    }

    static _createPhases(roadmapItems) {
        const phases = [];
        const high = roadmapItems.filter((i) => i.priority === 'High');
        const medium = roadmapItems.filter((i) => i.priority === 'Medium');

        if (high.length > 0) {
            phases.push({
                phase: 1,
                name: 'Foundation Building',
                duration: '0-3 months',
                skills: high.slice(0, 2).map((i) => i.skill),
                focus: 'Master core technologies essential for your role',
            });
        }
        const phase2Skills = [...high.slice(2), ...medium.slice(0, 2)];
        if (phase2Skills.length > 0) {
            phases.push({
                phase: 2,
                name: 'Skill Expansion',
                duration: '3-6 months',
                skills: phase2Skills.map((i) => i.skill),
                focus: 'Expand your technical toolkit with complementary skills',
            });
        }
        const remaining = roadmapItems.slice(4);
        if (remaining.length > 0) {
            phases.push({
                phase: 3,
                name: 'Advanced Mastery',
                duration: '6-12 months',
                skills: remaining.map((i) => i.skill),
                focus: 'Achieve expertise in specialized areas',
            });
        }
        return phases;
    }
}

export default RoadmapGenerator;
