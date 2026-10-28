import React from 'react';

export default function JsonLd() {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.chapterready.in/#organization",
        "name": "ChapterReady",
        "url": "https://www.chapterready.in",
        "logo": "https://www.chapterready.in/brand/chapterready-mark.svg",
        "description": "A textbook-faithful, step-by-step learning hub providing simplified NCERT notes, 3D interactive virtual labs, Tara AI Socratic tutoring, and CBSE Class 10 board mock exams.",
        "sameAs": [
          "https://github.com/sagarvarulegit/cbse_byCodex"
        ],
        "areaServed": {
          "@type": "Country",
          "name": "India"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.chapterready.in/#website",
        "url": "https://www.chapterready.in",
        "name": "ChapterReady.in",
        "publisher": {
          "@id": "https://www.chapterready.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.chapterready.in/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.chapterready.in/#app",
        "name": "ChapterReady CBSE Class 10 Learning Platform",
        "operatingSystem": "All (Web Browser, Responsive Mobile & Desktop)",
        "applicationCategory": "EducationalApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
          "description": "Free core NCERT notes, daily quizzes, and virtual labs; ₹199 for full 20-paper Board Pass."
        },
        "featureList": [
          "CBSE Class 10 NCERT Chapter Breakdowns",
          "Interactive 3D Virtual Science Labs & Ray Tracer",
          "Tara AI 24/7 Socratic Doubt Solving Companion",
          "3-Hour Computer Based Test (CBT) Board Mock Exams",
          "Official CBSE Step-Marking Scheme Evaluation & Deduction Traps"
        ]
      },
      {
        "@type": "Course",
        "@id": "https://www.chapterready.in/#course-class10",
        "name": "CBSE Class 10 Complete Board Exam Preparation",
        "description": "Master Class 10 one chapter at a time through the 5-step journey: Learn, Practice, Master, Revise, and Board Ready.",
        "provider": {
          "@id": "https://www.chapterready.in/#organization"
        },
        "educationalLevel": "Secondary Education (CBSE Class 10)",
        "inLanguage": "en-IN",
        "isAccessibleForFree": true,
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Online",
          "courseWorkload": "PT3H"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
