export async function extractWikiImageUrl(wikiUrl) {
  try {
    console.log(wikiUrl);
    const pageUrl = wikiUrl.replace(
      /^https:\/\/onepiece\.fandom\.com\/wiki\/File:/,

      "https://onepiece.fandom.com/wiki/Special:Redirect/file/"
    );

    const response = await fetch(pageUrl);

    if (response.url.includes("/revision/latest")) {
      const cleanUrl = response.url.split("/revision/latest")[0];

      return cleanUrl;
    }

    const html = await response.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(html, "text/html");

    const fullResLink = doc.querySelector(".fullMedia a.internal");

    if (fullResLink) {
      const href = fullResLink.getAttribute("href");

      return href.split("/revision")[0];
    }

    const mainImage = doc.querySelector("img[data-image-key]");

    if (mainImage) {
      const src = mainImage.getAttribute("src");

      return src.split("/revision")[0];
    }

    const filename = wikiUrl.split("/File:").pop();

    const relevantImage = doc.querySelector(
      `img[data-image-name="${filename}"]`
    );

    if (relevantImage) {
      const src = relevantImage.getAttribute("src");

      return src.split("/revision")[0];
    }

    const redirectUrl = `https://onepiece.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(
      filename
    )}`;

    const redirectResponse = await fetch(redirectUrl);

    if (redirectResponse.url.includes("/images/")) {
      return redirectResponse.url.split("/revision")[0];
    }

    throw new Error("Image not found");
  } catch (error) {
    console.error("Error extracting wiki image:", error);

    return null;
  }
}
