import { getModel } from "./../config/llmModels.js";

export const codingAgent = async (state) => {
    const codingllm = await getModel("coding");
    const intentllm = await getModel("intent");

    const intentRes = await intentllm.invoke(`
        You are an intent classifier.
        Return Only one of these values - 
        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        User Request: ${state.prompt}
        `);

    const intent = intentRes.content;
    console.log(intent)

    if (intent == "CODE_GENERATION") {
        const prompt = `
            You are a Coding Agent.

            Generate the requested project.

Default stack:

HTML
CSS
JavaScript

Do NOT use any framework unless explicitly requested.

Examples:

"Build portfolio"
→ HTML CSS JS

"Create ecommerce"
→ HTML CSS JS

"Create dashboard"
→ HTML CSS JS

"React dashboard"
→ React

"Next.js blog"
→ Next.js

=========================
WEBSITE RULE
=========================

Unless the user explicitly requests multiple pages,

ALWAYS build a SINGLE PAGE website.

Use sections:

Home
About
Services
Features
Pricing
Testimonials
Contact
Footer

Navigation should smoothly scroll.

Do NOT generate:

about.html
contact.html
pricing.html

unless the user explicitly asks.

=========================
PROJECT FILES
=========================

For default websites generate only:

FILE: index.html

FILE: style.css

FILE: script.js

Generate extra files ONLY if necessary.

=========================
DESIGN
=========================

Modern UI

Glassmorphism when suitable

Responsive

CSS Variables

Grid

Flexbox

Smooth Scroll

Hover Effects

Subtle Animations

Professional spacing

Compact CSS

=========================
IMAGES
=========================

Always use real Unsplash images.

Never use placeholders.

=========================
JAVASCRIPT
=========================

Keep JS minimal.

Only interactive logic.

No unnecessary functions.

=========================
OUTPUT
=========================

Return ONLY valid JSON.
Schema:
{
"files":[
{
"name":"index.html",
"content":"..."
},
{
"name":"style.css",
"content":"..."
},
{
"name":"script.js",
"content":"..."
}
]
}

Rules:

- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request : ${state.prompt}
            `;
        const res = await codingllm.invoke(prompt);
        const data = JSON.parse(res.content);
        console.log(data)
        return {
            ...state,
            aiResponse: "Your Code has been generated successfully.😎",
            artifacts: [
                {
                    id: Date.now(),
                    type: "project",
                    files: data.files || []
                }
            ]
        };
    }

    const res = await codingllm.invoke(`
        ${intent}

        Return Markdow only.

        Never generate project files.

        Use Headings Like:

        # Overview

        ## Explanation

        ## Problems

        ## Improvements

        ## Best Practices

        ## Optimized Code (if Needed)

        User Request: ${state.prompt}
        `)

        const data = res.content

        return {
            ...state,
            aiResponse:data,
            artifacts:[]
        }
};
