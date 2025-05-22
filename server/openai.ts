import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the AI travel assistant
const SYSTEM_PROMPT = `
You are an expert travel assistant for the Texas Hill Country region. Your name is "Hill Country Guide".
Provide helpful, personalized recommendations and answer questions about attractions, events, accommodations, and activities in the Texas Hill Country.

Key information about Texas Hill Country:
- Located in Central Texas, spanning numerous counties and towns
- Known for beautiful landscapes, wineries, state parks, and small-town charm
- Popular destinations include Fredericksburg, New Braunfels, Wimberley, Johnson City, Marble Falls, and more
- Known for vineyards, German heritage, swimming holes, hiking trails, and wildflower displays in spring
- Seasonal events include wine festivals, farmers markets, music festivals, and holiday celebrations

Always be friendly, conversational, and enthusiastic about the region. Focus on providing specific, helpful recommendations rather than general information.
If asked about topics outside Texas Hill Country travel, politely redirect the conversation back to the region.
`;

/**
 * Process a conversation with the AI travel assistant
 * @param messages Array of previous conversation messages
 * @returns The AI assistant's response
 */
export async function chatWithTravelAssistant(messages: Array<{role: string, content: string}>) {
  try {
    // Get the last user message for context
    const userMessage = messages.filter(msg => msg.role === "user").pop()?.content || "";
    
    console.log("Processing user message:", userMessage);
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not available, using local response generation");
      return getLocalTravelResponse(userMessage);
    }
    
    // Add the system prompt if it's not already present
    if (!messages.some(msg => msg.role === "system")) {
      messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    }

    // Format messages for OpenAI API
    const formattedMessages = messages.map(msg => {
      const role = ["system", "user", "assistant"].includes(msg.role) 
        ? msg.role as "system" | "user" | "assistant" 
        : "user";
      
      return { role, content: msg.content };
    });

    try {
      // Call the OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using a more reliable model
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      // Return the assistant's message
      return {
        role: "assistant",
        content: response.choices[0].message.content || "I'm sorry, I couldn't generate a response.",
      };
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      // Fall back to local response if API fails
      return getLocalTravelResponse(userMessage);
    }
  } catch (error) {
    console.error("Error in travel assistant:", error);
    
    // Return a fallback message
    return {
      role: "assistant",
      content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
    };
  }
}

/**
 * Generates a relevant travel response locally when API is unavailable
 * @param userMessage The user's message
 * @returns A response object with role and content
 */
function getLocalTravelResponse(userMessage: string): { role: string, content: string } {
  const userMessageLower = userMessage.toLowerCase();
  
  // Bluebonnets
  if (userMessageLower.includes("bluebonnet") || userMessageLower.includes("flower") || userMessageLower.includes("spring")) {
    return {
      role: "assistant",
      content: "The best places to see bluebonnets in the Texas Hill Country are typically along Highway 281 between Burnet and Lampasas, Willow City Loop near Fredericksburg, and Enchanted Rock State Natural Area. The peak blooming season is usually from late March to mid-April, depending on the weather. Remember to respect private property and never pick the flowers!"
    };
  }
  
  // Wineries
  if (userMessageLower.includes("wine") || userMessageLower.includes("vineyard") || userMessageLower.includes("winery")) {
    return {
      role: "assistant",
      content: "The Texas Hill Country is home to over 50 wineries! Some of the most highly recommended are Grape Creek Vineyards, Becker Vineyards, and William Chris Vineyards. The Wine Road 290 is a popular wine trail with numerous tasting rooms. For a special experience, consider visiting during the annual Wine & Wildflower Journey in April or the Christmas Wine Affair in December."
    };
  }
  
  // Family activities
  if (userMessageLower.includes("family") || userMessageLower.includes("kid") || userMessageLower.includes("children")) {
    return {
      role: "assistant",
      content: "Family-friendly activities in the Hill Country include exploring the Science Mill in Johnson City, tubing on the Guadalupe or Comal Rivers (in summer), visiting the Pioneer Museum in Fredericksburg, and hiking at Enchanted Rock. The Natural Bridge Wildlife Ranch near New Braunfels is also great for kids, offering a drive-through safari experience with over 500 animals!"
    };
  }
  
  // Fredericksburg
  if (userMessageLower.includes("fredericksburg")) {
    return {
      role: "assistant",
      content: "Fredericksburg is a charming German-influenced town in the heart of Hill Country. Must-visit attractions include the historic Main Street with its shops and restaurants, the National Museum of the Pacific War, Enchanted Rock State Natural Area, and numerous surrounding wineries. Don't miss trying the German cuisine at restaurants like Der Lindenbaum or the Auslander, and the famous peaches when they're in season!"
    };
  }
  
  // General Hill Country response
  return {
    role: "assistant",
    content: "The Texas Hill Country offers so many wonderful experiences! You can explore charming towns like Fredericksburg, New Braunfels, or Wimberley, visit award-winning wineries along Wine Road 290, enjoy outdoor activities at natural areas like Enchanted Rock or Hamilton Pool, or experience the region's German heritage through local festivals and cuisine. What specific aspects of Hill Country travel are you most interested in?"
  };
}