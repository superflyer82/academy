import { Category } from '@maengelmelder/shared-types';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface CategoryPickerProps {
  categories: Category[];
  selected?: string;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-sm font-medium mb-3">{t('report.selectCategory')} *</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label={t('report.category')}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="radio"
            aria-checked={selected === cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all text-center',
              'hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected === cat.id
                ? 'border-primary bg-primary/10 font-medium'
                : 'border-border bg-background'
            )}
          >
            <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
            <span className="text-xs sm:text-sm leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
