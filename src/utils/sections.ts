import { getCollection, type CollectionEntry } from "astro:content";

const sections = await getCollection('sections');

export async function getPostById(wantedId: string) {
  let entry = sections.find(e => e.id === wantedId);
  if (!entry) throw new Error(`Content not found for ${wantedId}`);
  const rendered = await entry.render();
  return {entry: entry, Content: rendered.Content};
}