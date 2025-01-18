"use client"


import React from "react";
import styles from "../styles/LandingPage.module.css";

const LandingPage = () => {
  const courseStructure = [
    {
      id: 1,
      title: "Basics of Video Editing",
      description:
        "Learn the fundamental concepts of video editing, including timeline management, cuts, and transitions.",
      topics: [
        "Interface overview",
        "Basic cuts & transitions",
        "Timeline management",
        "File organization",
      ],
      duration: "2 hours",
    },
    {
      id: 2,
      title: "Advanced Editing Techniques",
      description:
        "Master professional editing techniques used in the industry for seamless storytelling.",
      topics: [
        "Complex transitions",
        "Color grading",
        "Audio mixing",
        "Motion effects",
      ],
      duration: "3 hours",
    },
    {
      id: 3,
      title: "Visual Effects & Graphics",
      description:
        "Create stunning visual effects and incorporate graphics into your videos.",
      topics: [
        "Text animations",
        "Overlays",
        "Green screen",
        "Motion tracking",
      ],
      duration: "2.5 hours",
    },
    {
      id: 4,
      title: "Final Production & Export",
      description:
        "Learn professional workflow for finalizing and exporting your videos for different platforms.",
      topics: [
        "Export settings",
        "Platform optimization",
        "Compression",
        "Publishing workflow",
      ],
      duration: "1.5 hours",
    },
  ];

  const features = [
    {
      title: "Project-Based Learning",
      description:
        "Learn by working on real-world video editing projects. Apply your skills immediately with hands-on exercises.",
      icon: "🎯",
    },
    {
      title: "Industry-Standard Software",
      description:
        "Master the tools used by professionals. Get familiar with premiere editing software used in the industry.",
      icon: "💻",
    },
    {
      title: "Personalized Feedback",
      description:
        "Submit your projects and receive detailed feedback to improve your editing skills.",
      icon: "📝",
    },
    {
      title: "Resource Library",
      description:
        "Access a vast library of stock footage, music, and effects to use in your projects.",
      icon: "📚",
    },
    {
      title: "Flexible Learning",
      description:
        "Learn at your own pace with lifetime access to all course materials and future updates.",
      icon: "⏰",
    },
    {
      title: "Certificate",
      description:
        "Earn a certificate of completion to showcase your video editing expertise.",
      icon: "🏆",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      image: "/api/placeholder/64/64",
      text: "This course transformed my YouTube channel. The professional techniques I learned helped me double my subscriber count!",
    },
    {
      name: "Michael Chen",
      role: "Film Student",
      image: "/api/placeholder/64/64",
      text: "Clear, comprehensive, and practical. The instructor's approach made complex concepts easy to understand.",
    },
    {
      name: "Emma Davis",
      role: "Marketing Manager",
      image: "/api/placeholder/64/64",
      text: "Worth every penny! I now create professional-quality video content for our company's social media.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Master Video Editing</h1>
          <p className={styles.heroText}>
            Transform your raw footage into compelling stories with our
            comprehensive video editing course.
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>Start Learning Now</button>
            <button className={styles.secondaryButton}>Watch Preview</button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1000+</div>
            <div className={styles.statLabel}>Students Enrolled</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>9.5/10</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>40+</div>
            <div className={styles.statLabel}>Hours of Content</div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className={styles.courseSection}>
        <h2 className={styles.sectionTitle}>Course Curriculum</h2>
        <div className={styles.courseGrid}>
          {courseStructure.map((section) => (
            <div key={section.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3 className={styles.courseTitle}>{section.title}</h3>
                <span className={styles.duration}>{section.duration}</span>
              </div>
              <p className={styles.courseDescription}>{section.description}</p>
              <ul className={styles.topicList}>
                {section.topics.map((topic, index) => (
                  <li key={index} className={styles.topicItem}>
                    <span className={styles.checkmark}>✓</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className={styles.testimonialSection}>
        <h2 className={styles.sectionTitle}>What Our Students Say</h2>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={styles.testimonialImage}
                />
                <div>
                  <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                  <p className={styles.testimonialRole}>{testimonial.role}</p>
                </div>
              </div>
              <p className={styles.testimonialText}>{testimonial.text}</p>
            </div>
          ))}
        </div>
      </section> */}

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Our Course</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
          <button className={styles.primaryButton}>Enroll Now</button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
