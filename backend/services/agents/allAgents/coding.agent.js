import { deductUserCredits } from "../utils/deductUserCredits.js";
import { getModel } from "./../config/llmModels.js";

export const codingAgent = async (state) => {
    try {
        // -----------------------------------------
        // 1. Get LLM Models
        // -----------------------------------------
        const codingllm = await getModel("coding");
        const intentllm = await getModel("intent");

        // -----------------------------------------
        // 2. Detect User Intent
        // -----------------------------------------
        const intentRes = await intentllm.invoke(`
You are an intent classifier.

Return ONLY one of these exact values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

Do not return anything else.

User Request:
${state.prompt}
        `);

        // Normalize intent
        const intent = String(intentRes.content)
            .trim()
            .replace(/["']/g, "")

        console.log("Detected Intent:", intent);

        // -----------------------------------------
        // 3. CODE GENERATION
        // -----------------------------------------
        if (intent === "CODE_GENERATION") {

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

The response MUST follow this exact structure:

{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

IMPORTANT:

- Output must start with {
- Output must end with }
- No markdown
- No code fences
- No explanation
- No extra text
- Always use real Unsplash images
- Never mention the intent

User Request:
${state.prompt}
            `;

            // -----------------------------------------
            // 4. Generate Project
            // -----------------------------------------
            const res = await codingllm.invoke(prompt);

            console.log("Raw Coding LLM Response:");
            console.log(res.content);

            // -----------------------------------------
            // 5. Clean LLM JSON Response
            // -----------------------------------------
            let jsonContent = String(res.content).trim();

            // Remove markdown code fences if LLM adds them
            jsonContent = jsonContent
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            // -----------------------------------------
            // 6. Parse JSON
            // -----------------------------------------
            let data;

            try {
                data = JSON.parse(jsonContent);
            } catch (parseError) {

                console.error("❌ JSON Parse Error:", parseError);
                console.error("❌ LLM Response:", jsonContent);

                return {
                    ...state,
                    aiResponse:
                        "❌ Coding Agent returned an invalid project format.",
                    artifacts: []
                };
            }

            // -----------------------------------------
            // 7. Validate Generated Files
            // -----------------------------------------
            if (!data || !Array.isArray(data.files)) {

                console.error(
                    "❌ Invalid project structure:",
                    data
                );

                return {
                    ...state,
                    aiResponse:
                        "❌ Generated project has an invalid file structure.",
                    artifacts: []
                };
            }

            console.log("Generated Files:", data.files);

            // -----------------------------------------
            // 8. Deduct Credits
            // -----------------------------------------
            await deductUserCredits(
                state.userId,
                "coding"
            );

            // -----------------------------------------
            // 9. Return Generated Project
            // -----------------------------------------
            return {
                ...state,

                aiResponse:
                    "Your Code has been generated successfully. 😎",

                artifacts: [
                    {
                        id: Date.now(),
                        type: "project",
                        files: data.files,
                        title: state.prompt
                    }
                ]
            };
        }

        // -----------------------------------------
        // 10. Other Coding Intents
        // -----------------------------------------
        const res = await codingllm.invoke(`
${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if Needed)

User Request:
${state.prompt}
        `);

        const data = res.content;

        // -----------------------------------------
        // 11. Deduct Credits
        // -----------------------------------------
        await deductUserCredits(
            state.userId,
            "coding"
        );

        // -----------------------------------------
        // 12. Return Explanation / Review / Debugging
        // -----------------------------------------
        return {
            ...state,
            aiResponse: data,
            artifacts: []
        };

    } catch (error) {

        // -----------------------------------------
        // Global Error Handler
        // -----------------------------------------
        console.error("❌ Coding Agent Error:", error);

        return {
            ...state,
            aiResponse: "❌ Failed to generate response.",
            artifacts: []
        };
    }
};