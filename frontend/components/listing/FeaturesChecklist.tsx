"use client";

import { useLanguage } from "@/contexts/language-context";
export default function FeaturesChecklist({
  groups,
}: {
  groups: { title: string; items: { label: string; checked: boolean }[] }[];
}) {
  const { t } = useLanguage();
  if (!groups?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
      <h3 className="text-gray-900 font-medium mb-3">{t('home.featured')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((g, gi) => (
          <div key={gi}>
            <div className="text-gray-700 font-medium mb-2">{g.title}</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {g.items.map((it, i) => (
                <li key={i} className="inline-flex items-center gap-2 text-gray-700">
                  <input type="checkbox" checked={it.checked} readOnly className="accent-gray-900" />
                  <span>{it.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}


