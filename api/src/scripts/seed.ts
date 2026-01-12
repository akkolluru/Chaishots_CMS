import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Create default users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chaishots.com' },
    update: {},
    create: {
      email: 'admin@chaishots.com',
      password: await argon2.hash('password123'),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@chaishots.com' },
    update: {},
    create: {
      email: 'editor@chaishots.com',
      password: await argon2.hash('password123'),
      firstName: 'Editor',
      lastName: 'User',
      role: 'editor',
    },
  });

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@chaishots.com' },
    update: {},
    create: {
      email: 'viewer@chaishots.com',
      password: await argon2.hash('password123'),
      firstName: 'Viewer',
      lastName: 'User',
      role: 'viewer',
    },
  });

  console.log('Created default users');

  // Create default topics
  const mathTopic = await prisma.topic.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: {
      name: 'Mathematics',
    },
  });

  const scienceTopic = await prisma.topic.upsert({
    where: { name: 'Science' },
    update: {},
    create: {
      name: 'Science',
    },
  });

  console.log('Created default topics');

  // Create programs
  const mathProgram = await prisma.program.create({
    data: {
      title: 'Advanced Mathematics',
      description: 'A comprehensive program covering advanced mathematical concepts',
      languagePrimary: 'en',
      languagesAvailable: ['en', 'te'], // English and Telugu
      status: 'published',
      publishedAt: new Date(),
      topics: {
        create: [{
          topic: {
            connect: { id: mathTopic.id }
          }
        }]
      }
    }
  });

  const scienceProgram = await prisma.program.create({
    data: {
      title: 'Basic Science',
      description: 'An introductory program to basic science concepts',
      languagePrimary: 'te', // Telugu
      languagesAvailable: ['te', 'en'], // Telugu and English
      status: 'draft',
      topics: {
        create: [{
          topic: {
            connect: { id: scienceTopic.id }
          }
        }]
      }
    }
  });

  console.log('Created programs');

  // Create program assets for math program (primary language: English)
  await prisma.programAsset.create({
    data: {
      programId: mathProgram.id,
      language: 'en',
      variant: 'portrait',
      assetType: 'poster',
      url: 'https://example.com/math-portrait-en.jpg'
    }
  });

  await prisma.programAsset.create({
    data: {
      programId: mathProgram.id,
      language: 'en',
      variant: 'landscape',
      assetType: 'poster',
      url: 'https://example.com/math-landscape-en.jpg'
    }
  });

  // Create program assets for math program in Telugu
  await prisma.programAsset.create({
    data: {
      programId: mathProgram.id,
      language: 'te',
      variant: 'portrait',
      assetType: 'poster',
      url: 'https://example.com/math-portrait-te.jpg'
    }
  });

  await prisma.programAsset.create({
    data: {
      programId: mathProgram.id,
      language: 'te',
      variant: 'landscape',
      assetType: 'poster',
      url: 'https://example.com/math-landscape-te.jpg'
    }
  });

  // Create program assets for science program (primary language: Telugu)
  await prisma.programAsset.create({
    data: {
      programId: scienceProgram.id,
      language: 'te',
      variant: 'portrait',
      assetType: 'poster',
      url: 'https://example.com/science-portrait-te.jpg'
    }
  });

  await prisma.programAsset.create({
    data: {
      programId: scienceProgram.id,
      language: 'te',
      variant: 'landscape',
      assetType: 'poster',
      url: 'https://example.com/science-landscape-te.jpg'
    }
  });

  console.log('Created program assets');

  // Create terms
  const term1 = await prisma.term.create({
    data: {
      programId: mathProgram.id,
      termNumber: 1,
      title: 'Algebra Basics'
    }
  });

  const term2 = await prisma.term.create({
    data: {
      programId: mathProgram.id,
      termNumber: 2,
      title: 'Calculus Fundamentals'
    }
  });

  console.log('Created terms');

  // Create lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      termId: term1.id,
      lessonNumber: 1,
      title: 'Introduction to Algebra',
      contentType: 'video',
      durationMs: 1800000, // 30 minutes
      isPaid: false,
      contentLanguagePrimary: 'en',
      contentLanguagesAvailable: ['en', 'te'],
      contentUrlsByLanguage: {
        en: 'https://example.com/algebra-intro-en.mp4',
        te: 'https://example.com/algebra-intro-te.mp4'
      },
      subtitleLanguages: ['en', 'te'],
      subtitleUrlsByLanguage: {
        en: 'https://example.com/algebra-intro-en.vtt',
        te: 'https://example.com/algebra-intro-te.vtt'
      },
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date()
    }
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      termId: term1.id,
      lessonNumber: 2,
      title: 'Linear Equations',
      contentType: 'article',
      isPaid: true,
      contentLanguagePrimary: 'en',
      contentLanguagesAvailable: ['en'],
      contentUrlsByLanguage: {
        en: 'https://example.com/linear-equations-en.html'
      },
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date()
    }
  });

  // Create a scheduled lesson that will be published in the next 2 minutes (for demo)
  const scheduledTime = new Date();
  scheduledTime.setMinutes(scheduledTime.getMinutes() + 2); // 2 minutes from now

  const lesson3 = await prisma.lesson.create({
    data: {
      termId: term1.id,
      lessonNumber: 3,
      title: 'Quadratic Equations',
      contentType: 'video',
      durationMs: 2400000, // 40 minutes
      isPaid: true,
      contentLanguagePrimary: 'te',
      contentLanguagesAvailable: ['te', 'en'],
      contentUrlsByLanguage: {
        te: 'https://example.com/quadratic-te.mp4',
        en: 'https://example.com/quadratic-en.mp4'
      },
      subtitleLanguages: ['te'],
      subtitleUrlsByLanguage: {
        te: 'https://example.com/quadratic-te.vtt'
      },
      status: 'scheduled',
      publishAt: scheduledTime,
      createdAt: new Date()
    }
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      termId: term2.id,
      lessonNumber: 1,
      title: 'Limits and Continuity',
      contentType: 'video',
      durationMs: 3000000, // 50 minutes
      isPaid: true,
      contentLanguagePrimary: 'en',
      contentLanguagesAvailable: ['en'],
      contentUrlsByLanguage: {
        en: 'https://example.com/limits-en.mp4'
      },
      status: 'draft',
      createdAt: new Date()
    }
  });

  const lesson5 = await prisma.lesson.create({
    data: {
      termId: term2.id,
      lessonNumber: 2,
      title: 'Derivatives',
      contentType: 'article',
      isPaid: false,
      contentLanguagePrimary: 'en',
      contentLanguagesAvailable: ['en', 'te'],
      contentUrlsByLanguage: {
        en: 'https://example.com/derivatives-en.html',
        te: 'https://example.com/derivatives-te.html'
      },
      status: 'draft',
      createdAt: new Date()
    }
  });

  const lesson6 = await prisma.lesson.create({
    data: {
      termId: term2.id,
      lessonNumber: 3,
      title: 'Integration',
      contentType: 'video',
      durationMs: 3600000, // 60 minutes
      isPaid: true,
      contentLanguagePrimary: 'te',
      contentLanguagesAvailable: ['te'],
      contentUrlsByLanguage: {
        te: 'https://example.com/integration-te.mp4'
      },
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date()
    }
  });

  console.log('Created lessons');

  // Create lesson assets for lesson1 (English primary)
  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson1.id,
      language: 'en',
      variant: 'portrait',
      assetType: 'thumbnail',
      url: 'https://example.com/algebra-intro-portrait-en.jpg'
    }
  });

  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson1.id,
      language: 'en',
      variant: 'landscape',
      assetType: 'thumbnail',
      url: 'https://example.com/algebra-intro-landscape-en.jpg'
    }
  });

  // Create lesson assets for lesson1 in Telugu
  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson1.id,
      language: 'te',
      variant: 'portrait',
      assetType: 'thumbnail',
      url: 'https://example.com/algebra-intro-portrait-te.jpg'
    }
  });

  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson1.id,
      language: 'te',
      variant: 'landscape',
      assetType: 'thumbnail',
      url: 'https://example.com/algebra-intro-landscape-te.jpg'
    }
  });

  // Create lesson assets for lesson3 (Telugu primary)
  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson3.id,
      language: 'te',
      variant: 'portrait',
      assetType: 'thumbnail',
      url: 'https://example.com/quadratic-portrait-te.jpg'
    }
  });

  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson3.id,
      language: 'te',
      variant: 'landscape',
      assetType: 'thumbnail',
      url: 'https://example.com/quadratic-landscape-te.jpg'
    }
  });

  // Create lesson assets for lesson6 (Telugu primary)
  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson6.id,
      language: 'te',
      variant: 'portrait',
      assetType: 'thumbnail',
      url: 'https://example.com/integration-portrait-te.jpg'
    }
  });

  await prisma.lessonAsset.create({
    data: {
      lessonId: lesson6.id,
      language: 'te',
      variant: 'landscape',
      assetType: 'thumbnail',
      url: 'https://example.com/integration-landscape-te.jpg'
    }
  });

  console.log('Created lesson assets');

  console.log('Database seeding completed!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });