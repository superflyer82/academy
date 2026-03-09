import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, PlusCircle, Search } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Mängelmelder</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Melden Sie Schäden und Probleme im öffentlichen Raum direkt an die Stadt Musterhausen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/melden">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t('report.title')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/karte">
              <MapPin className="mr-2 h-5 w-5" />
              {t('map.title')}
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: '📝', title: 'Einfach melden', desc: 'In wenigen Schritten Mängel einreichen – ohne Registrierung.' },
            { icon: '📍', title: 'Standort angeben', desc: 'Präzise Ortsangabe per Karte oder GPS.' },
            { icon: '📬', title: 'Status verfolgen', desc: 'Ticket-ID oder E-Mail – bleiben Sie informiert.' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border p-5 bg-card">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/verfolgen" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
            <Search className="h-4 w-4" />
            Meldung per Ticket-ID verfolgen
          </Link>
        </div>
      </div>
    </div>
  );
}
