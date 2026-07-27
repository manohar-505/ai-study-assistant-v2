import { motion } from 'framer-motion';
import {
  Upload,
  Brain,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Star,
  Zap,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Upload,
    title: 'Upload PDF Notes',
    description:
      'Simply upload your study materials in PDF format and let our AI do the heavy lifting.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'AI Explanation',
    description:
      'Get detailed, easy-to-understand explanations of complex topics powered by advanced AI.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Summary',
    description:
      'Transform lengthy documents into concise summaries that capture all essential points.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: HelpCircle,
    title: 'Quiz Generator',
    description:
      'Automatically generate practice quizzes to test your knowledge and improve retention.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '50K+', label: 'Notes Processed' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <main className="relative">
        <div className="absolute inset-0 mesh-gradient" />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    Trusted by 10,000+ students
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  Learn Faster with{' '}
                  <span className="gradient-text">AI.</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                  Upload your study notes and instantly get AI-powered
                  explanations, summaries, and quizzes. Transform the way you
                  study.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="gradient-primary hover:gradient-primary-hover text-white font-semibold px-8 py-6 rounded-xl glow text-lg group"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 rounded-xl border-border hover:bg-muted text-lg"
                  >
                    Learn More
                  </Button>
                </div>

                <div className="flex gap-8 mt-12">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="text-3xl font-bold gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Content - AI Preview Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-30 animate-pulse-slow" />

                <div className="relative glass-card rounded-3xl p-8 glow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl gradient-primary">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        AI Processing
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Analyzing your notes...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-white">
                          Key Concepts Extracted
                        </span>
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.2 }}
                            className="h-2 bg-gradient-to-r from-primary/50 to-secondary/50 rounded"
                            style={{ width: `${80 - i * 15}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-white">
                          Summary Generated
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-2 bg-muted rounded"
                            style={{ width: `${100 - i * 10}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {['Quiz Ready', '5 Questions', 'Easy to Hard'].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium glass text-muted-foreground"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Brain Icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-8 -right-8 glass-card rounded-2xl p-4 shadow-glass"
                >
                  <Brain className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Powerful <span className="gradient-text">Features</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Everything you need to supercharge your learning experience
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  About <span className="gradient-text">StudyMind AI</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  We believe that learning should be efficient, engaging, and
                  personalized. StudyMind AI leverages cutting-edge artificial
                  intelligence to transform how students interact with their
                  study materials.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our platform analyzes your notes, extracts key concepts, and
                  creates personalized learning experiences that help you
                  understand faster and remember longer.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: Zap,
                      label: 'Instant Processing',
                      desc: 'Results in seconds',
                    },
                    {
                      icon: Brain,
                      label: 'Smart AI',
                      desc: 'Context-aware analysis',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg gradient-primary">
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {item.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20" />
                <div className="relative glass-card rounded-3xl p-8 shadow-glass">
                  <div className="text-center">
                    <div className="inline-flex p-4 rounded-2xl gradient-primary mb-6">
                      <Brain className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Start Learning Smarter Today
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of students who have transformed their
                      study habits with AI.
                    </p>
                    <Link to="/dashboard">
                      <Button className="gradient-primary hover:gradient-primary-hover text-white font-semibold px-8 py-6 rounded-xl glow-sm w-full">
                        Get Started for Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
