"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/constants";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const getSectionTitle = (title: string): string => {
    switch (title.toLowerCase()) {
      case "about":
        return t.footer.sections.about;
      case "company":
        return t.footer.sections.company;
      case "socials":
        return t.footer.sections.socials;
      default:
        return title;
    }
  };

  const getItemTitle = (title: string): string => {
    switch (title.toLowerCase()) {
      case "how it works":
        return t.footer.sections.howItWorks;
      case "featured":
        return t.footer.sections.featured;
      case "partnership":
        return t.footer.sections.partnership;
      case "bussiness relation":
      case "business relation":
        return t.footer.sections.businessRelation;
      case "events":
        return t.footer.sections.events;
      case "blog":
        return t.footer.sections.blog;
      case "podcast":
        return t.footer.sections.podcast;
      case "invite a friend":
        return t.footer.sections.inviteFriend;
      default:
        return title;
    }
  };

  return (
    <footer className="flex flex-col text-black-100 dark:text-gray-200 mt-5 border-t border-gray-100 dark:border-slate-800 transition-colors">
      <div className="flex max-md:flex-col flex-wrap justify-between px-6 py-10 gap-5 sm:px-16">
        <div className="flex justify-start items-start flex-col gap-6">
          <Image
            src="/yusrilprayoga.svg"
            alt={t.navbar.logoAlt}
            width={118}
            height={18}
            className="object-contain dark:invert transition-all"
          />
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            CarShowroom 2024 <br />
            {t.footer.rightsReserved}
          </p>
        </div>

        <div className="footer__links ltr:md:justify-end rtl:md:justify-start">
          {footerLinks.map((link) => (
            <div key={link.title} className="footer__link">
              <h3 className="font-bold text-black-100 dark:text-white transition-colors">{getSectionTitle(link.title)}</h3>
              {link.links.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="text-gray-700 dark:text-gray-400 hover:text-primary-blue dark:hover:text-primary-blue transition"
                  target="_blank"
                >
                  {getItemTitle(item.title)}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between flex-wrap mt-10 border-gray-100 dark:border-slate-800 sm:px-16 items-center border-t px-6 py-10 gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t.footer.copyright}</p>
        <div className="footer__copyrights-link ltr:sm:justify-end rtl:sm:justify-start">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-black-100 dark:hover:text-white transition text-sm">
            {t.footer.privacyPolicy}
          </Link>
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-black-100 dark:hover:text-white transition text-sm">
            {t.footer.termsOfService}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
