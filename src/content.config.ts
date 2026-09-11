import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Optional crop, used to emphasise one region of a wider screenshot.
 * All four values are pixel coordinates in the *source* image, so the
 * rectangle stays correct no matter what size it is rendered at.
 */
const crop = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

/** Stage colour behind a screenshot. Omit to inherit the section's accent. */
const tone = z.enum(['mix', 'mint', 'blue', 'violet', 'peach', 'grey', 'plain', 'bluefade']);

/** One phase of the Double Diamond: a short claim, then the detail behind it. */
const phase = z.object({
  lede: z.string(),
  text: z.string(),
});

const screen = z.object({
  img: z.string(),
  alt: z.string(),
  caption: z.string(),
  crop: crop.optional(),
  tone: tone.optional(),
  /** Composites that already carry their own cards: skip the white plate. */
  bare: z.boolean().optional(),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/work' }),
  schema: z.object({
    /** Controls grid order and the homepage sequence. */
    order: z.number(),

    /** Homepage card */
    name: z.string(),
    desc: z.string(),
    /** Pastel bed behind the homepage card. */
    tone: tone,
    /** Raster thumb for the compact ProjectCard grid; unused by ProjectFeature. */
    thumb: z.string().optional(),

    /** Masthead meta row: client · discipline · year · domain */
    client: z.string(),
    discipline: z.string(),
    year: z.string(),
    domain: z.string(),

    /** Case study head */
    title: z.string(),
    overview: z.string(),
    role: z.string(),
    liveUrl: z.string().optional(),

    /** Case study body */
    hero: screen,
    question: z.string(),
    context: z.string(),
    goal: z.string(),
    principles: z.array(z.object({ name: z.string(), text: z.string() })).min(2).max(4),
    solutions: z
      .array(
        z.object({
          name: z.string(),
          problem: z.string(),
          headline: z.string(),
          how: z.string(),
          screens: z.array(screen).min(1).max(2),
        })
      )
      .min(2)
      .max(4),

    /**
     * Optional Double Diamond write-up, shown between the challenge and the
     * design response. The four phases are fixed keys rather than an array so
     * a case study can't accidentally ship a three-sided diamond.
     */
    process: z
      .object({
        lede: z.string().optional(),
        discover: phase,
        define: phase,
        develop: phase,
        deliver: phase,
      })
      .optional(),

    /** Optional end-to-end walkthrough, shown after the numbered solutions. */
    flow: z
      .object({
        lede: z.string(),
        steps: z
          .array(
            z.object({
              name: z.string(),
              img: z.string(),
              alt: z.string(),
              caption: z.string().optional(),
              tone: tone.optional(),
            })
          )
          .min(2)
          .max(6),
      })
      .optional(),

    /** Closing pair — a short lede and the paragraph behind it. */
    impact: z.object({ lede: z.string(), body: z.string() }),
    learning: z.object({ lede: z.string(), body: z.string() }),
  }),
});

export const collections = { work };
