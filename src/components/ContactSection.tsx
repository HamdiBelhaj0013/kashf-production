"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Languages, Clock, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { SocialLinks } from "@/lib/api";

const formVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.4 } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

export default function ContactSection({ socialLinks }: { socialLinks: SocialLinks }) {
  const t = useTranslations("Contact");
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { Icon: Mail,      labelKey: "emailLabel"     as const, valueKey: "emailValue"     as const, href: "mailto:hello@kashf.tn" },
    { Icon: MapPin,    labelKey: "locationLabel"  as const, valueKey: "locationValue"  as const, href: "#" },
    { Icon: Languages, labelKey: "languagesLabel" as const, valueKey: "languagesValue" as const, href: "#" },
    { Icon: Clock,     labelKey: "responseLabel"  as const, valueKey: "responseValue"  as const, href: "#" },
  ];

  const inputClass =
    "w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 transition-all duration-200";

  return (
    <section id="contact" className="w-full bg-white py-28 scroll-m-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* ── Left: info ─────────────────────────────────────────────── */}
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-5">
              {t("label")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6 text-gray-900">
              {t("title")}
              <br />
              <span className="text-gray-400">{t("titleHighlight")}</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              {t("subtitle")}
            </p>

            <div className="space-y-4 mb-10">
              {contactInfo.map(({ Icon, labelKey, valueKey, href }) => (
                <a key={labelKey} href={href} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-900 transition-all duration-300">
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      {t(labelKey)}
                    </p>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {t(valueKey)}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links — only rendered when at least one URL is set */}
            {(() => {
              const socials = [
                { name: "Instagram", url: socialLinks.instagram },
                { name: "LinkedIn",  url: socialLinks.linkedin  },
                { name: "Behance",   url: socialLinks.behance   },
              ].filter((s) => s.url.trim() !== "");

              if (socials.length === 0) return null;

              return (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-4">
                    {t("followAlong")}
                  </p>
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all text-center group"
                      >
                        <div className="text-xs font-bold text-gray-900 group-hover:text-gray-700">
                          {s.name}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}
          </AnimatedSection>

          {/* ── Right: form ─────────────────────────────────────────────── */}
          <AnimatedSection delay={0.2}>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm overflow-hidden min-h-[480px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {submitted ? (
                  // ── Success state ──────────────────────────────────────
                  <motion.div
                    key="success"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {t("successTitle")}
                    </h3>
                    <p className="text-gray-500 text-sm mb-8">{t("successDesc")}</p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", service: "", message: "" });
                      }}
                      className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-700 transition-colors"
                    >
                      {t("sendAnother")}
                    </button>
                  </motion.div>
                ) : (
                  // ── Form ──────────────────────────────────────────────
                  <motion.form
                    key="form"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {t("formTitle")}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder={t("name")}
                        value={form.name}
                        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                        required
                        className={inputClass}
                      />
                      <input
                        type="email"
                        placeholder={t("email")}
                        value={form.email}
                        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                        required
                        className={inputClass}
                      />
                    </div>

                    <select
                      value={form.service}
                      onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
                      className={inputClass + " cursor-pointer text-gray-500"}
                    >
                      <option value="" disabled>{t("service")}</option>
                      <option>{t("serviceVideo")}</option>
                      <option>{t("serviceAudio")}</option>
                      <option>{t("serviceDesign")}</option>
                      <option>{t("serviceWeb")}</option>
                      <option>{t("servicePack")}</option>
                      <option>{t("serviceOther")}</option>
                    </select>

                    <textarea
                      rows={5}
                      placeholder={t("message")}
                      value={form.message}
                      onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                      required
                      className={inputClass + " resize-none"}
                    />

                    {submitError && (
                      <p className="text-red-500 text-sm text-center">{submitError}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : t("send")}
                      {!submitting && <Send className="w-4 h-4" />}
                    </motion.button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{t("disclaimer")}</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
}
