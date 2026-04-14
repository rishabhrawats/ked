import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Package, Briefcase, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";

const steps = ["Business Type", "Basic Info", "Profile Details", "Complete"];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    businessName: "",
    email: "",
    phone: "",
    location: "",
    category: "",
    description: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12 min-h-screen" data-testid="seller-onboarding-page">
        <div className="ked-container">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-ked-accent rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-text-body mb-4">
                <Sparkles className="w-3.5 h-3.5 text-ked-primary" />
                Join KED as a Seller
              </span>
              <h1 className="font-serif text-4xl text-ked-text mb-3">Start Your Journey</h1>
              <p className="font-sans text-sm text-ked-text-muted">
                Join 2,500+ women entrepreneurs selling on KED. It takes less than 5 minutes.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-12" data-testid="onboarding-progress">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all ${
                    i <= currentStep ? "bg-ked-primary text-white" : "bg-ked-surface border border-ked-border text-ked-text-muted"
                  }`}>
                    {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ${i < currentStep ? "bg-ked-primary" : "bg-ked-border"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-ked-border rounded-2xl p-6 md:p-10"
            >
              {/* Step 1: Business Type */}
              {currentStep === 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-ked-text mb-2">What best describes you?</h2>
                  <p className="font-sans text-sm text-ked-text-muted mb-8">Choose the option that fits your business.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => { setFormData({ ...formData, type: "product" }); }}
                      className={`flex flex-col items-center gap-3 p-6 border rounded-2xl transition-all ${
                        formData.type === "product"
                          ? "border-ked-primary bg-ked-accent/50 shadow-sm"
                          : "border-ked-border hover:bg-ked-surface"
                      }`}
                      data-testid="type-product"
                    >
                      <Package className="w-10 h-10 text-ked-primary" />
                      <span className="font-sans text-sm font-medium text-ked-text">I Sell Products</span>
                      <span className="font-sans text-xs text-ked-text-muted text-center">Handmade, clothing, food, beauty, craft, home products</span>
                    </button>
                    <button
                      onClick={() => { setFormData({ ...formData, type: "service" }); }}
                      className={`flex flex-col items-center gap-3 p-6 border rounded-2xl transition-all ${
                        formData.type === "service"
                          ? "border-ked-primary bg-ked-accent/50 shadow-sm"
                          : "border-ked-border hover:bg-ked-surface"
                      }`}
                      data-testid="type-service"
                    >
                      <Briefcase className="w-10 h-10 text-ked-primary" />
                      <span className="font-sans text-sm font-medium text-ked-text">I Offer Services</span>
                      <span className="font-sans text-xs text-ked-text-muted text-center">Coaching, consulting, teaching, wellness, design</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Info */}
              {currentStep === 1 && (
                <div>
                  <h2 className="font-serif text-2xl text-ked-text mb-2">Tell us about yourself</h2>
                  <p className="font-sans text-sm text-ked-text-muted mb-8">Basic details to get you started.</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="onboard-name"
                    />
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="onboard-business-name"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                        data-testid="onboard-email"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                        data-testid="onboard-phone"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="onboard-location"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Profile Details */}
              {currentStep === 2 && (
                <div>
                  <h2 className="font-serif text-2xl text-ked-text mb-2">Almost there!</h2>
                  <p className="font-sans text-sm text-ked-text-muted mb-8">Help buyers discover your brand.</p>
                  <div className="space-y-4">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="onboard-category"
                    >
                      <option value="">Select Category</option>
                      <option value="Fashion">Fashion & Textiles</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Food">Food & Spices</option>
                      <option value="Beauty">Beauty & Skincare</option>
                      <option value="Home">Home Decor</option>
                      <option value="Wellness">Wellness & Health</option>
                      <option value="Education">Education & Training</option>
                      <option value="Design">Design & Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                    <textarea
                      rows={4}
                      placeholder="Tell your brand story in a few lines... (What do you make/offer? What makes it special?)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30 resize-none"
                      data-testid="onboard-description"
                    />
                    {/* Photo Upload Area */}
                    <div className="border-2 border-dashed border-ked-border rounded-xl p-8 text-center hover:border-ked-primary/40 transition-colors cursor-pointer" data-testid="onboard-photo-upload">
                      <Camera className="w-8 h-8 text-ked-text-muted mx-auto mb-3" />
                      <p className="font-sans text-sm text-ked-text-muted">Upload your profile photo</p>
                      <p className="font-sans text-xs text-ked-text-muted/60 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {currentStep === 3 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-ked-success mx-auto mb-6" />
                  </motion.div>
                  <h2 className="font-serif text-3xl text-ked-text mb-3">Welcome to KED!</h2>
                  <p className="font-sans text-base text-ked-text-muted mb-8 max-w-md mx-auto">
                    Your seller profile is being set up. Our team will verify your details and you'll be live within 24 hours.
                  </p>
                  <div className="bg-ked-accent rounded-xl p-4 mb-8 max-w-sm mx-auto">
                    <p className="text-xs font-sans text-ked-text-body">
                      While you wait, explore the KED community, check out workshops, and get inspired by other women entrepreneurs.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-ked-border">
                {currentStep > 0 && currentStep < 3 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-sm font-sans text-ked-text-muted hover:text-ked-text transition-colors"
                    data-testid="onboard-prev"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-ked-primary text-white rounded-full px-6 py-2.5 font-sans text-sm font-medium hover:bg-ked-primary-hover transition-all"
                    data-testid="onboard-next"
                  >
                    {currentStep === 2 ? "Submit" : "Continue"} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
