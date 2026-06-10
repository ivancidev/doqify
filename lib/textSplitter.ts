/**
 * Splits text into chunks of roughly `chunkSize` characters with a given `chunkOverlap`.
 * Attempts to split at natural boundaries like newlines, sentence endings, or word spaces.
 */
export function splitText(
  text: string,
  chunkSize: number = 800,
  chunkOverlap: number = 150
): string[] {
  const chunks: string[] = [];
  
  // Clean up excessive whitespace
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  
  let currentIndex = 0;

  while (currentIndex < normalizedText.length) {
    // If the remaining text fits in one chunk, push it and finish
    if (currentIndex + chunkSize >= normalizedText.length) {
      const chunk = normalizedText.slice(currentIndex).trim();
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      break;
    }

    const searchRange = normalizedText.slice(currentIndex, currentIndex + chunkSize);
    let splitIndex = chunkSize;

    // Look for natural split points, starting from the end of our chunk size
    const lastDoubleNewline = searchRange.lastIndexOf("\n\n");
    const lastNewline = searchRange.lastIndexOf("\n");
    const lastSentence = searchRange.lastIndexOf(". ");
    const lastSpace = searchRange.lastIndexOf(" ");

    // Prioritize paragraphs (\n\n), then newlines (\n), then sentence endings (. ), then spaces
    if (lastDoubleNewline > chunkSize * 0.6) {
      splitIndex = lastDoubleNewline + 2;
    } else if (lastNewline > chunkSize * 0.7) {
      splitIndex = lastNewline + 1;
    } else if (lastSentence > chunkSize * 0.75) {
      splitIndex = lastSentence + 2;
    } else if (lastSpace > chunkSize * 0.5) {
      splitIndex = lastSpace + 1;
    }

    const chunk = normalizedText.slice(currentIndex, currentIndex + splitIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move next index back by overlap
    currentIndex += splitIndex - chunkOverlap;

    // Safeguard to prevent infinite loops if overlap is too aggressive
    if (splitIndex <= chunkOverlap) {
      currentIndex = currentIndex + chunkSize - chunkOverlap;
    }
  }

  return chunks;
}
