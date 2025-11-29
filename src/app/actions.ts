'use server';

import { z } from "zod";
import { Resend } from 'resend';
import { ComplaintSchema } from "@/lib/definitions";
import { identifyRelevantLegalSections } from "@/ai/ai-chatbot-legal-sections";
import { enhanceComplaint } from "@/ai/flows/enhance-complaint-flow";
import { translateText, type TranslateTextInput } from '@/ai/flows/translate-text-flow';
import { textToSpeech } from "@/ai/flows/tts-flow";

type ComplaintFormState = {
  message: string;
  status: "success" | "error" | "idle";
};

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendComplaintEmail(enhancedProblem: string, senderEmail?: string) {
  const recipient = "ireneaq2522@gmail.com";
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_Jfr87pev_AQif8Bo6ZfZKqAMzADVhEEWU') {
    console.log("RESEND_API_KEY not found or is placeholder. Simulating email sending.");
    console.log(`Simulating: Sending complaint email to ${recipient}`);
    console.log("Enhanced Complaint:", enhancedProblem);
    if(senderEmail) console.log("Sender Email:", senderEmail);
    return;
  }

  try {
    let emailHtml = `
      <p>A new complaint has been filed and enhanced by AI for clarity:</p>
      <div style="border: 1px solid #eee; padding: 16px; border-radius: 8px; background-color: #f9f9f9;">
        <p>${enhancedProblem.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    if (senderEmail) {
      emailHtml += `<p>The sender provided their email for follow-up: <a href="mailto:${senderEmail}">${senderEmail}</a></p>`;
    } else {
      emailHtml += `<p>The sender did not provide an email address.</p>`;
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipient,
      subject: 'New Enhanced Complaint Filed - LawHelp AI',
      html: emailHtml,
    });
    console.log('Complaint email sent successfully.');
  } catch (error) {
    console.error("Error sending email:", error);
    // We can decide if we want to throw the error or just log it.
    // For now, we'll just log it so it doesn't break the user-facing flow.
  }
}

export async function submitComplaint(
  prevState: ComplaintFormState,
  formData: FormData
): Promise<ComplaintFormState> {
  try {
    const validatedFields = ComplaintSchema.safeParse({
      problem: formData.get("problem"),
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
      return {
        message: firstError ?? "Invalid input.",
        status: "error",
      };
    }

    const { problem, email } = validatedFields.data;

    const { enhancedProblem } = await enhanceComplaint({ problem });

    // In a real application, you would store this in a database (e.g., Firestore)
    console.log("New Complaint Received:", { problem, email, enhancedProblem });

    // Send email notification with the enhanced content
    await sendComplaintEmail(enhancedProblem, email || undefined);

    return {
      message:
        "Your complaint has been submitted successfully. We will review it shortly.",
      status: "success",
    };
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      status: "error",
    };
  }
}

export async function analyzeIssue(issue: string) {
  if (!issue) {
    return { error: "Issue description cannot be empty." };
  }
  try {
    const result = await identifyRelevantLegalSections({ userIssue: issue });
    return { data: {
      caseType: result.caseType,
      section: result.sectionNumber,
      explanation: result.explanation,
      nextSteps: result.nextSteps,
      escalationPath: result.escalationPath,
    } };
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return {
      error:
        "Sorry, we couldn't analyze your issue at this time. Please try again later.",
    };
  }
}

export async function handleTranslation(input: TranslateTextInput) {
  if (!input.text || !input.targetLanguage) {
    return { error: "Text and target language are required." };
  }
  try {
    const result = await translateText(input);
    return { data: result };
  } catch (error) {
    console.error("Error in translation:", error);
    return {
      error: "Sorry, we couldn't translate your text at this time. Please try again later.",
    };
  }
}

export async function getAudioForText(text: string) {
  if (!text) {
    return { error: "Text cannot be empty." };
  }
  try {
    const result = await textToSpeech(text);
    return { data: result };
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    return {
      error: "Sorry, we couldn't generate audio at this time. Please try again later.",
    };
  }
}
