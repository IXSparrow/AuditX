import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const AI_API_KEY = process.env.AI_API_KEY || '';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 401 });
    }

    const { auditId, prompt } = await req.json();

    if (!auditId) {
      return NextResponse.json({ error: 'Audit ID is required.' }, { status: 400 });
    }

    // Fetch the audit to verify user ownership
    const { data: audit, error: auditError } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', session.user.id)
      .single();

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit entry not found or access denied.' }, { status: 404 });
    }

    const targetUrl = audit.url;
    const userPromptStyle = prompt || "modern dark minimalist SaaS style with vibrant neon accents";
    const reportData = audit.report_json;

    // AI Prompt specifically for custom visual layout redesign
    const redesignSystemPrompt = `You are a legendary lead UI/UX designer and frontend architect.
Generate a breathtaking responsive HTML section using Tailwind CSS that showcases a redesigned premium version of the target website's hero or core page.
Return strict JSON with no markdown wrapping. The JSON must contain:
{
  "strategy": string (explanation of the visual upgrade decisions),
  "hero_title": string,
  "hero_subtitle": string,
  "cta_text": string,
  "color_palette": string[] (array of 4 hex color strings),
  "typography": {
    "headings": string,
    "body": string
  },
  "layout_wireframe": string (step-by-step layout sections explanation),
  "html_concept": string (a complete, copy-pasteable, extremely beautiful responsive frontend card or viewport container utilizing Tailwind CSS classes, inline styling, and premium gradient grids suitable for demonstrating the redesigned aesthetic),
  "cta_improvement": string
}`;

    const redesignUserPrompt = `Redesign website: ${targetUrl}
Design prompt/style requested by user: "${userPromptStyle}"
Current website title: "${audit.domain}"
Current report scores: Design: ${audit.design_score}, SEO: ${audit.seo_score}, Speed: ${audit.speed_score}.
Make sure the Tailwind HTML is self-contained and renders a highly impressive hero screen component (with glassmorphism cards, glowing buttons, glowing background spots, and luxurious dark elements). Do not include <html> or <body> tags. Start directly with a modern <div>.`;

    let generatedConcept = {
      strategy: `Redesigning ${audit.domain} with a high-end luxury dark glassmorphism system.`,
      hero_title: `Experience next-generation visual design on ${audit.domain}`,
      hero_subtitle: "Crafted by AuditX AI Redesign Studio. Fully optimized for high conversions, accessibility compliance, and absolute lightning performance.",
      cta_text: "Activate Premium Concept",
      color_palette: ["#09090b", "#7c3aed", "#10b981", "#ffffff"],
      typography: { headings: "Inter", body: "Inter" },
      layout_wireframe: "Glassmorphic hero banner -> Dynamic visual asset -> Multi-column CTA validation grid",
      html_concept: "",
      cta_improvement: "Enrich contrast and apply interactive scaling effects."
    };

    if (AI_API_KEY) {
      try {
        let responseText = '';
        const isOpenRouter = AI_API_KEY.startsWith("sk-or-") || AI_API_KEY.includes("openrouter");

        if (isOpenRouter) {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${AI_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://auditx.ai",
              "X-Title": "AuditX AI Redesign Studio"
            },
            body: JSON.stringify({
              model: "google/gemini-1.5-pro",
              messages: [
                { role: "system", content: redesignSystemPrompt },
                { role: "user", content: redesignUserPrompt }
              ]
            })
          });
          
          if (response.ok) {
            const json = await response.json();
            responseText = json.choices[0]?.message?.content || '';
          }
        } else {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${AI_API_KEY}`;
          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: redesignSystemPrompt + "\n\n" + redesignUserPrompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });

          if (response.ok) {
            const json = await response.json();
            responseText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        }

        if (responseText) {
          if (responseText.includes("```")) {
            responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          }
          generatedConcept = JSON.parse(responseText);
        }
      } catch (aiError) {
        console.error("AI Redesign generation error, falling back to report pre-cached direction:", aiError);
        // If custom AI redesign fails, parse design data from original report JSON if it exists
        if (reportData?.redesign_direction) {
          const rd = reportData.redesign_direction;
          generatedConcept = {
            strategy: rd.strategy || generatedConcept.strategy,
            hero_title: rd.copy?.hero_title || generatedConcept.hero_title,
            hero_subtitle: rd.copy?.hero_subtitle || generatedConcept.hero_subtitle,
            cta_text: rd.copy?.cta_text || generatedConcept.cta_text,
            color_palette: rd.color_palette || generatedConcept.color_palette,
            typography: rd.typography || generatedConcept.typography,
            layout_wireframe: rd.layout_wireframe || generatedConcept.layout_wireframe,
            html_concept: rd.tailwind_preview_concept || generatedConcept.html_concept,
            cta_improvement: rd.cta_improvement || generatedConcept.cta_improvement
          };
        }
      }
    } else if (reportData?.redesign_direction) {
      const rd = reportData.redesign_direction;
      generatedConcept = {
        strategy: rd.strategy,
        hero_title: rd.copy?.hero_title,
        hero_subtitle: rd.copy?.hero_subtitle,
        cta_text: rd.copy?.cta_text,
        color_palette: rd.color_palette,
        typography: rd.typography,
        layout_wireframe: rd.layout_wireframe,
        html_concept: rd.tailwind_preview_concept,
        cta_improvement: rd.cta_improvement
      };
    }

    // Default HTML if none generated
    if (!generatedConcept.html_concept) {
      generatedConcept.html_concept = `
        <div class="p-8 md:p-12 rounded-3xl bg-zinc-950 border border-purple-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center items-center text-center space-y-6">
          <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl"></div>
          <div class="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-600/10 blur-3xl"></div>
          
          <span class="px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider">AI Redesign Wireframe</span>
          <h2 class="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">${generatedConcept.hero_title}</h2>
          <p class="text-zinc-400 max-w-xl text-base md:text-lg">${generatedConcept.hero_subtitle}</p>
          
          <div class="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <button class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5">${generatedConcept.cta_text}</button>
            <span class="text-xs text-zinc-500 underline font-medium cursor-pointer hover:text-zinc-300">Explore Interactive Spec</span>
          </div>
          
          <div class="mt-8 pt-8 border-t border-zinc-900 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Contrast Ratio</span>
              <span class="text-white font-bold text-lg">21:1 AAA</span>
            </div>
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Typography</span>
              <span class="text-white font-bold text-lg">${generatedConcept.typography.headings}</span>
            </div>
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Color Theme</span>
              <div class="flex gap-1 items-center mt-1">
                ${generatedConcept.color_palette.map(c => `<div class="h-4 w-4 rounded-full border border-zinc-800" style="background-color: ${c}"></div>`).join('')}
              </div>
            </div>
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Load Score</span>
              <span class="text-emerald-400 font-bold text-lg">100/100</span>
            </div>
          </div>
        </div>
      `;
    }

    // Insert redesign entry in DB
    const { data: redesign, error: insertError } = await supabaseAdmin
      .from('redesign_previews')
      .insert({
        audit_id: auditId,
        prompt: userPromptStyle,
        preview_url: null,
        html_concept: generatedConcept.html_concept,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to insert redesign concept to database:", insertError);
    }

    return NextResponse.json({
      success: true,
      redesign: redesign || { id: 'temp-id', html_concept: generatedConcept.html_concept, prompt: userPromptStyle, created_at: new Date().toISOString() },
      concept: generatedConcept
    });

  } catch (error: any) {
    console.error('Redesign generate route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
