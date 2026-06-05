import { useMemo, useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { Card, Button, Icon, Badge } from "../ui";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const buildMonthMatrix = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const cells = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const Calendar = () => {
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const today = new Date();

  const cells = useMemo(
    () => buildMonthMatrix(current.year, current.month),
    [current],
  );

  const move = (delta) =>
    setCurrent((prev) => {
      const total = prev.year * 12 + prev.month + delta;
      return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
    });

  const isToday = (day) =>
    day === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Calendrier"
        description="Vue mensuelle des événements"
      />

      <Card padding="lg" radius="xl">
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-title-lg font-semibold text-ink">
              {MONTHS[current.month]} {current.year}
            </h2>
            <Badge variant="primary" size="sm">
              {today.toLocaleDateString("fr-FR", { dateStyle: "long" })}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconOnly
              leftIcon="ChevronLeft"
              onClick={() => move(-1)}
              aria-label="Mois précédent"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrent({
                  year: today.getFullYear(),
                  month: today.getMonth(),
                })
              }
            >
              {"Aujourd'hui"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconOnly
              leftIcon="ChevronRight"
              onClick={() => move(1)}
              aria-label="Mois suivant"
            />
          </div>
        </header>

        <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-neutral-200 dark:border-secondary-500">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="bg-neutral-50 px-3 py-2.5 text-center text-caption font-semibold uppercase tracking-wide text-ink-muted dark:bg-secondary-800"
            >
              {day}
            </div>
          ))}
          {cells.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[88px] border-t border-l border-neutral-200 p-3 transition-colors dark:border-secondary-500 ${
                idx % 7 === 0 ? "border-l-0" : ""
              } ${
                day === null
                  ? "bg-neutral-50/50 dark:bg-secondary-800/40"
                  : "bg-white hover:bg-primary-50/40 dark:bg-secondary-700 dark:hover:bg-secondary-600"
              }`}
            >
              {day !== null && (
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-body-sm font-medium ${
                      isToday(day)
                        ? "bg-primary-500 text-secondary-900"
                        : "text-ink"
                    }`}
                  >
                    {day}
                  </span>
                  {day === 1 && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-tertiary-500" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-body-sm text-ink-muted">
          <span className="flex items-center gap-2">
            <Icon name="Circle" size="xs" className="fill-primary-500 text-primary-500" />
            {"Aujourd'hui"}
          </span>
          <span className="flex items-center gap-2">
            <Icon name="Circle" size="xs" className="fill-tertiary-500 text-tertiary-500" />
            Événement
          </span>
        </div>
      </Card>
    </DefaultLayout>
  );
};

export default Calendar;
