// Fallback mechanisms for when API keys are missing

/**
 * Gets a fallback response for the travel assistant when OpenAI API is not available
 */
export function getFallbackTravelResponse(userMessage: string): { role: string, content: string } {
  // Simple pattern matching for some common user queries
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.includes('hey')) {
    return {
      role: 'assistant',
      content: "Hello! I'm the Hill Country Travel Assistant. While our AI service is currently being set up, I can still provide some general information about the Texas Hill Country. You might want to explore Fredericksburg, Enchanted Rock, or visit the amazing wineries in the region. For more detailed recommendations, please check back soon when our full AI service is available."
    };
  }
  
  if (lowerMessage.includes('fredericksburg') || lowerMessage.includes('fredericks')) {
    return {
      role: 'assistant',
      content: "Fredericksburg is one of the jewels of the Hill Country! Known for its German heritage, wineries, and charming Main Street shopping. While our AI service is being configured, you might want to explore our website for more details about accommodations and attractions in Fredericksburg."
    };
  }
  
  if (lowerMessage.includes('wine') || lowerMessage.includes('winery') || lowerMessage.includes('wineries')) {
    return {
      role: 'assistant',
      content: "The Hill Country is famous for its wineries! The area around Fredericksburg and Johnson City features dozens of award-winning wineries. Our full AI assistant will soon be able to recommend specific wineries based on your preferences. In the meantime, check out our Attractions section for featured wineries."
    };
  }
  
  if (lowerMessage.includes('hike') || lowerMessage.includes('hiking') || lowerMessage.includes('trail')) {
    return {
      role: 'assistant',
      content: "The Hill Country offers amazing hiking opportunities! Enchanted Rock, Pedernales Falls State Park, and Lost Maples Natural Area are just a few highlights. While we're setting up our AI service, you can find more information in our Attractions section under the 'Outdoor' category."
    };
  }
  
  if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat')) {
    return {
      role: 'assistant',
      content: "Hill Country cuisine is a delightful mix of German, Texan, and Mexican influences! While our AI assistant is being configured, you might want to explore our website for featured restaurants. German food in Fredericksburg and BBQ throughout the region are definitely worth trying!"
    };
  }
  
  // Default fallback response
  return {
    role: 'assistant',
    content: "Thank you for your message about the Hill Country. While our AI service is currently being set up, I can provide some general information. The Texas Hill Country offers beautiful landscapes, charming towns like Fredericksburg and Wimberley, outdoor adventures, wineries, and rich cultural experiences. For more specific recommendations, please check back soon when our full AI service is available, or explore our website for details about destinations, attractions, and accommodations."
  };
}

/**
 * Utility function to check if a service is configured with necessary API keys
 */
export function isServiceConfigured(requiredEnvVars: string[]): boolean {
  return requiredEnvVars.every(varName => {
    const value = process.env[varName];
    return value !== undefined && value !== '';
  });
}