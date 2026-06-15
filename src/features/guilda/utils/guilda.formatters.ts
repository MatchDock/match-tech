export function getGithubUrl(value: string) {
  if (!value) return "";

  const clean = value
    .trim()
    .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, "")
    .replace(/\/$/, "")
    .replace(/^@/, "");

  return `https://github.com/${clean}`;
}

export function getLinkedinUrl(value: string) {
  if (!value) return "";

  const clean = value
    .trim()
    .replace(/^(?:https?:\/\/)?(?:[\w-]+\.)?linkedin\.com\/(?:in|profile)\//i, "")
    .replace(/\/$/, "")
    .replace(/^@/, "");

  return `https://linkedin.com/in/${clean}`;
}

export function getAvatarSources(
  photoURL: string | undefined,
  github: string | undefined,
  githubUrlFormatter: (value: string) => string,
) {
  const sources: string[] = [];

  if (photoURL) {
    let photo = photoURL;
    if (photo.includes("googleusercontent.com") && photo.includes("=s96-c")) {
      photo = photo.replace("=s96-c", "=s400-c");
    } else if (photo.includes("googleusercontent.com") && !photo.includes("=")) {
      photo = `${photo}=s400-c`;
    }
    sources.push(photo);
  }

  if (github) {
    sources.push(`${githubUrlFormatter(github)}.png`);
  }

  return sources;
}
