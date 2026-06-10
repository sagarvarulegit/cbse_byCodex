import { PrismaClient, UserRole, AccessLevel, PublishStatus } from '@prisma/client';
import { hashPassword } from '../src/lib/auth.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Users
  const adminEmail = 'admin@cbse.bycodex';
  const adminPasswordHash = await hashPassword('AdminPassword123');
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: UserRole.admin,
      status: 'active',
      profile: {
        create: {
          fullName: 'Default Admin',
          classLevel: 10,
        }
      }
    }
  });
  console.log(`Seeded admin user: ${admin.email}`);

  const studentEmail = 'student@cbse.bycodex';
  const studentPasswordHash = await hashPassword('StudentPassword123');
  
  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: { passwordHash: studentPasswordHash },
    create: {
      email: studentEmail,
      passwordHash: studentPasswordHash,
      role: UserRole.student,
      status: 'active',
      profile: {
        create: {
          fullName: 'Default Student',
          classLevel: 10,
        }
      }
    }
  });
  console.log(`Seeded student user: ${student.email}`);

  // 2. Create Subjects
  const mathSubject = await prisma.subject.upsert({
    where: { slug: 'mathematics' },
    update: {},
    create: {
      name: 'Mathematics',
      slug: 'mathematics',
      classLevel: 10,
      description: 'CBSE Class 10 Mathematics',
      isPublished: true,
      sortOrder: 1,
    }
  });
  console.log(`Seeded subject: ${mathSubject.name}`);

  const scienceSubject = await prisma.subject.upsert({
    where: { slug: 'science' },
    update: {},
    create: {
      name: 'Science',
      slug: 'science',
      classLevel: 10,
      description: 'CBSE Class 10 Science',
      isPublished: true,
      sortOrder: 2,
    }
  });
  console.log(`Seeded subject: ${scienceSubject.name}`);

  // 3. Create Chapters
  const mathChapter = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: mathSubject.id, slug: 'real-numbers' } },
    update: {},
    create: {
      subjectId: mathSubject.id,
      title: 'Real Numbers',
      slug: 'real-numbers',
      ncertChapterNumber: 1,
      description: "Explore Euclid's Division Lemma, the Fundamental Theorem of Arithmetic, and the properties of rational and irrational numbers.",
      isPublished: true,
      sortOrder: 1,
    }
  });
  console.log(`Seeded chapter: ${mathChapter.title}`);

  const scienceChapter = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: scienceSubject.id, slug: 'chemical-reactions-and-equations' } },
    update: {},
    create: {
      subjectId: scienceSubject.id,
      title: 'Chemical Reactions and Equations',
      slug: 'chemical-reactions-and-equations',
      ncertChapterNumber: 1,
      description: 'Understand chemical equations, types of chemical reactions, and their everyday implications.',
      isPublished: true,
      sortOrder: 1,
    }
  });
  console.log(`Seeded chapter: ${scienceChapter.title}`);

  // 4. Create Topics, Lessons under Mathematics (Real Numbers)
  const mathTopics = [
    {
      title: "Euclid's Division Lemma",
      slug: "euclid-division-lemma",
      description: "Understand the divisibility properties of integers.",
      sortOrder: 1,
      estimatedMinutes: 20,
      lessons: [
        {
          title: "Introduction to Euclid's Division Lemma",
          slug: "introduction-to-euclids-division-lemma",
          description: "Learn about divisibility of integers and the lemma statement.",
          learningObjective: "State and explain Euclid's Division Lemma with practical division cases.",
          accessLevel: AccessLevel.free,
          sortOrder: 1,
          estimatedMinutes: 15,
        }
      ]
    },
    {
      title: "Fundamental Theorem of Arithmetic",
      slug: "fundamental-theorem-of-arithmetic",
      description: "Explore prime factorization and prime factorization uniqueness.",
      sortOrder: 2,
      estimatedMinutes: 25,
      lessons: [
        {
          title: "Prime Factorisation and Uniqueness",
          slug: "prime-factorisation-and-uniqueness",
          description: "Learn about composite numbers and factorization uniqueness.",
          learningObjective: "Factorize composite numbers and understand the uniqueness of prime factorisation.",
          accessLevel: AccessLevel.premium,
          sortOrder: 1,
          estimatedMinutes: 20,
        }
      ]
    },
    {
      title: "HCF and LCM by Prime Factorisation",
      slug: "hcf-and-lcm-by-prime-factorisation",
      description: "Find HCF and LCM of numbers and check their properties.",
      sortOrder: 3,
      estimatedMinutes: 20,
      lessons: [
        {
          title: "Finding HCF and LCM",
          slug: "finding-hcf-and-lcm",
          description: "Learn how to use prime factors to compute HCF and LCM.",
          learningObjective: "Apply prime factorisation to compute HCF and LCM of numbers and verify key relationship formulas.",
          accessLevel: AccessLevel.premium,
          sortOrder: 1,
          estimatedMinutes: 15,
        }
      ]
    },
    {
      title: "Irrational Numbers",
      slug: "irrational-numbers",
      description: "Learn about proofs of irrationality of square roots of primes.",
      sortOrder: 4,
      estimatedMinutes: 30,
      lessons: [
        {
          title: "Proofs of Irrationality",
          slug: "proofs-of-irrationality",
          description: "Prove that numbers like sqrt(2), sqrt(3), etc., are irrational.",
          learningObjective: "Construct contradiction proofs for the irrationality of specific square root values.",
          accessLevel: AccessLevel.premium,
          sortOrder: 1,
          estimatedMinutes: 25,
        }
      ]
    },
    {
      title: "Decimal Expansion of Rational Numbers",
      slug: "decimal-expansion-of-rational-numbers",
      description: "Classify rational numbers into terminating or non-terminating repeating decimals.",
      sortOrder: 5,
      estimatedMinutes: 20,
      lessons: [
        {
          title: "Terminating and Non-Terminating Decimals",
          slug: "terminating-and-non-terminating-decimals",
          description: "Verify decimal expansion conditions using prime factors of denominators.",
          learningObjective: "Explain rational number decimal expansions using the prime factor properties of the denominators.",
          accessLevel: AccessLevel.premium,
          sortOrder: 1,
          estimatedMinutes: 15,
        }
      ]
    }
  ];

  for (const topicData of mathTopics) {
    const topic = await prisma.topic.upsert({
      where: { chapterId_slug: { chapterId: mathChapter.id, slug: topicData.slug } },
      update: {},
      create: {
        chapterId: mathChapter.id,
        title: topicData.title,
        slug: topicData.slug,
        description: topicData.description,
        sortOrder: topicData.sortOrder,
        estimatedMinutes: topicData.estimatedMinutes,
        isPublished: true,
      }
    });

    for (const lessonData of topicData.lessons) {
      await prisma.lesson.upsert({
        where: { topicId_slug: { topicId: topic.id, slug: lessonData.slug } },
        update: {},
        create: {
          topicId: topic.id,
          title: lessonData.title,
          slug: lessonData.slug,
          description: lessonData.description,
          learningObjective: lessonData.learningObjective,
          accessLevel: lessonData.accessLevel,
          sortOrder: lessonData.sortOrder,
          estimatedMinutes: lessonData.estimatedMinutes,
          publishStatus: PublishStatus.published,
          publishedAt: new Date(),
        }
      });
    }
  }
  console.log('Mathematics Real Numbers topics and lessons seeded.');

  // 5. Create Topics, Lessons under Science (Chemical Reactions and Equations)
  const scienceTopics = [
    {
      title: "Chemical Equations",
      slug: "chemical-equations",
      description: "Learn about writing and balancing chemical equations.",
      sortOrder: 1,
      estimatedMinutes: 25,
      lessons: [
        {
          title: "Balancing Chemical Equations",
          slug: "balancing-chemical-equations",
          description: "Master the step-by-step process of balancing chemical reactions.",
          learningObjective: "Apply the hit-and-trial method to balance any chemical equation correctly.",
          accessLevel: AccessLevel.free,
          sortOrder: 1,
          estimatedMinutes: 20,
        }
      ]
    }
  ];

  for (const topicData of scienceTopics) {
    const topic = await prisma.topic.upsert({
      where: { chapterId_slug: { chapterId: scienceChapter.id, slug: topicData.slug } },
      update: {},
      create: {
        chapterId: scienceChapter.id,
        title: topicData.title,
        slug: topicData.slug,
        description: topicData.description,
        sortOrder: topicData.sortOrder,
        estimatedMinutes: topicData.estimatedMinutes,
        isPublished: true,
      }
    });

    for (const lessonData of topicData.lessons) {
      await prisma.lesson.upsert({
        where: { topicId_slug: { topicId: topic.id, slug: lessonData.slug } },
        update: {},
        create: {
          topicId: topic.id,
          title: lessonData.title,
          slug: lessonData.slug,
          description: lessonData.description,
          learningObjective: lessonData.learningObjective,
          accessLevel: lessonData.accessLevel,
          sortOrder: lessonData.sortOrder,
          estimatedMinutes: lessonData.estimatedMinutes,
          publishStatus: PublishStatus.published,
          publishedAt: new Date(),
        }
      });
    }
  }
  console.log('Science Chemical Reactions topics and lessons seeded.');

  console.log('Database seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
