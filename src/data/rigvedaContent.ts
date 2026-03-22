import { Chapter } from '../types';

export type BlockType = 'intro' | 'quote' | 'teaching' | 'story' | 'lesson' | 'reflection' | 'fact';

export interface ContentBlock {
  type: BlockType;
  content: string | string[];
  title?: string;
  author?: string;
}

export interface VedaPage {
  title: string;
  blocks: ContentBlock[];
}

export const RIGVEDA_CONTENT: VedaPage[] = [
  {
    title: "The Beginning of Light",
    blocks: [
      {
        type: 'intro',
        content: "Welcome to the Rigveda, the oldest of the four Vedas. It is a collection of hymns that celebrate the divine presence in nature."
      },
      {
        type: 'quote',
        content: "Truth is one, though the wise call it by many names.",
        author: "Rigveda 1.164.46"
      },
      {
        type: 'fact',
        content: "The Rigveda contains 1,028 hymns and over 10,000 verses."
      },
      {
        type: 'reflection',
        content: "How do you find unity in the diversity around you today?"
      }
    ]
  },
  {
    title: "The Song of Creation",
    blocks: [
      {
        type: 'intro',
        content: "The Nasadiya Sukta is one of the most profound hymns, questioning the very origin of the universe."
      },
      {
        type: 'teaching',
        content: "Before creation, there was neither existence nor non-existence. Everything was a deep, silent mystery."
      },
      {
        type: 'story',
        content: "Imagine a time before time, where only the 'One' breathed, breathless, by its own power."
      },
      {
        type: 'lesson',
        content: "It’s okay not to have all the answers. Curiosity is the first step toward wisdom."
      }
    ]
  },
  {
    title: "Agni: The Divine Fire",
    blocks: [
      {
        type: 'intro',
        content: "Agni is the god of fire, the messenger between humans and the divine."
      },
      {
        type: 'teaching',
        content: "Fire represents transformation. Just as fire purifies, our inner fire (willpower) purifies our thoughts."
      },
      {
        type: 'quote',
        content: "O Agni, lead us on the path of prosperity.",
        author: "Rigveda"
      },
      {
        type: 'fact',
        content: "Agni is the first word of the first hymn of the Rigveda."
      },
      {
        type: 'reflection',
        content: "What is one habit you want to 'burn away' to make room for growth?"
      }
    ]
  },
  {
    title: "Indra: The Lord of Storms",
    blocks: [
      {
        type: 'intro',
        content: "Indra is the king of the gods, representing courage, strength, and the power of the monsoon."
      },
      {
        type: 'story',
        content: "Indra defeated the dragon Vritra, who had stolen all the world's water, bringing life back to the earth."
      },
      {
        type: 'lesson',
        content: "Challenges (dragons) are meant to be overcome to release our inner potential (water)."
      },
      {
        type: 'fact',
        content: "Indra is the most mentioned deity in the Rigveda, with over 250 hymns dedicated to him."
      }
    ]
  },
  {
    title: "Varuna: The Guardian of Order",
    blocks: [
      {
        type: 'intro',
        content: "Varuna is the keeper of Rita, the cosmic order that keeps the stars in the sky and the seasons turning."
      },
      {
        type: 'teaching',
        content: "Living in harmony with nature and truth is the highest form of worship."
      },
      {
        type: 'quote',
        content: "Varuna knows the path of the birds that fly through the air.",
        author: "Rigveda"
      },
      {
        type: 'reflection',
        content: "In what ways can you bring more order and balance to your daily routine?"
      }
    ]
  },
  {
    title: "The Wisdom of the Rivers",
    blocks: [
      {
        type: 'intro',
        content: "The Rigveda celebrates the 'Seven Rivers' as life-giving goddesses."
      },
      {
        type: 'teaching',
        content: "Like a river, life is a constant flow. Resistance causes struggle; flowing brings peace."
      },
      {
        type: 'fact',
        content: "The Saraswati river, now lost, was considered the most sacred and powerful in Vedic times."
      },
      {
        type: 'lesson',
        content: "Stay fluid in your thinking. Don't get stuck in old patterns."
      }
    ]
  },
  {
    title: "Dawn: The Awakening",
    blocks: [
      {
        type: 'intro',
        content: "Ushas, the goddess of Dawn, is praised for her beauty and for waking the world to action."
      },
      {
        type: 'quote',
        content: "Ushas, the daughter of Heaven, has appeared, bringing light to all.",
        author: "Rigveda"
      },
      {
        type: 'lesson',
        content: "Every morning is a fresh start. Leave yesterday's shadows behind."
      },
      {
        type: 'reflection',
        content: "What is the first positive thought you want to wake up with tomorrow?"
      }
    ]
  },
  {
    title: "The Power of Speech (Vach)",
    blocks: [
      {
        type: 'intro',
        content: "Speech is considered a goddess (Vach) who carries the wisdom of the universe."
      },
      {
        type: 'teaching',
        content: "Our words have the power to create or destroy. Speak with intention and kindness."
      },
      {
        type: 'fact',
        content: "The Rigveda was preserved for thousands of years through oral tradition, perfectly memorized without being written down."
      },
      {
        type: 'reflection',
        content: "Think of a time a kind word changed your day. How can you be that person for someone else?"
      }
    ]
  },
  {
    title: "Soma: The Nectar of Insight",
    blocks: [
      {
        type: 'intro',
        content: "Soma is both a sacred plant and the moon, representing inspiration and the 'juice' of life."
      },
      {
        type: 'teaching',
        content: "True inspiration comes from a clear and joyful mind."
      },
      {
        type: 'quote',
        content: "We have drunk Soma and become immortal; we have attained the light.",
        author: "Rigveda"
      },
      {
        type: 'fact',
        content: "Soma is often associated with the moon because it was believed to be the vessel of the nectar of the gods."
      },
      {
        type: 'lesson',
        content: "Find what 'nourishes' your soul—be it art, music, or nature."
      }
    ]
  },
  {
    title: "The Unity of All Things",
    blocks: [
      {
        type: 'intro',
        content: "The Rigveda teaches that everything in the universe is interconnected."
      },
      {
        type: 'teaching',
        content: "We are not separate from nature; we are a part of it."
      },
      {
        type: 'quote',
        content: "May the wind blow sweet for us; may the rivers flow sweet.",
        author: "Rigveda"
      },
      {
        type: 'lesson',
        content: "When you help others or protect nature, you are essentially helping yourself."
      },
      {
        type: 'reflection',
        content: "What is one small act you can do today to help someone else?"
      }
    ]
  },
  {
    title: "The Cosmic Sacrifice",
    blocks: [
      {
        type: 'intro',
        content: "The Purusha Sukta describes the universe as a giant cosmic being."
      },
      {
        type: 'teaching',
        content: "Sacrifice doesn't mean losing something; it means giving your best for the greater good."
      },
      {
        type: 'story',
        content: "The gods sacrificed the 'Cosmic Man' to create the moon, the sun, and all living creatures."
      },
      {
        type: 'lesson',
        content: "Great things are often built through teamwork and shared effort."
      }
    ]
  },
  {
    title: "Nature as a Teacher",
    blocks: [
      {
        type: 'intro',
        content: "The Rishis (sages) found wisdom by observing the sun, the wind, and the trees."
      },
      {
        type: 'teaching',
        content: "Nature is the original classroom. Silence and observation lead to deep insights."
      },
      {
        type: 'fact',
        content: "Many Vedic hymns are dedicated to the 'Vishwa Devas'—all the gods of the universe acting as one."
      },
      {
        type: 'reflection',
        content: "Spend 5 minutes in silence today. What do you hear?"
      }
    ]
  },
  {
    title: "The Breath of Life",
    blocks: [
      {
        type: 'intro',
        content: "Prana, or the life force, is what connects our body to the cosmic energy."
      },
      {
        type: 'teaching',
        content: "Conscious breathing can calm the mind and energize the spirit."
      },
      {
        type: 'quote',
        content: "The breath of the universe is the spirit of the gods.",
        author: "Rigveda"
      },
      {
        type: 'lesson',
        content: "When stressed, take three deep breaths. It’s the simplest way to reset."
      }
    ]
  },
  {
    title: "Seeking the Truth",
    blocks: [
      {
        type: 'intro',
        content: "The Rigveda encourages questioning and personal experience over blind belief."
      },
      {
        type: 'teaching',
        content: "Wisdom is not just reading; it is 'seeing' the truth for yourself."
      },
      {
        type: 'quote',
        content: "Let noble thoughts come to us from every side.",
        author: "Rigveda 1.89.1"
      },
      {
        type: 'reflection',
        content: "Are you open to new ideas, even if they challenge what you already know?"
      }
    ]
  },
  {
    title: "The Legacy of the Rishis",
    blocks: [
      {
        type: 'intro',
        content: "The sages who 'saw' these hymns wanted to pass on a legacy of peace and light."
      },
      {
        type: 'teaching',
        content: "We are the torchbearers of this ancient wisdom in the modern world."
      },
      {
        type: 'quote',
        content: "Walk together, speak together, let your minds be all of one accord.",
        author: "Rigveda 10.191.2"
      },
      {
        type: 'lesson',
        content: "Unity and harmony are the ultimate goals of human existence."
      },
      {
        type: 'fact',
        content: "The Rigveda is recognized by UNESCO as a 'Memory of the World' heritage."
      }
    ]
  }
];
