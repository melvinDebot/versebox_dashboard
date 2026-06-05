import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseContext";
import { Badge, Icon } from "../../ui";

const flattenChallenges = (challengesByCategory) => {
  if (!challengesByCategory) return [];
  return Object.entries(challengesByCategory).flatMap(([category, list]) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => ({
      ...item,
      _category: category,
      _index: idx,
    }));
  });
};

const matchesTerm = (challenge, term) => {
  const haystacks = [
    challenge.verse,
    challenge.verseText,
    challenge.verseDescription,
    challenge.challenge,
    challenge.level,
    String(challenge.point ?? ""),
    challenge._category,
    Array.isArray(challenge.categories)
      ? challenge.categories.join(" ")
      : challenge.categories,
  ];
  return haystacks.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(term),
  );
};

const ChallengeSearch = () => {
  const { challengesByCategory } = useFirebase();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const allChallenges = useMemo(
    () => flattenChallenges(challengesByCategory),
    [challengesByCategory],
  );

  const results = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return [];
    return allChallenges.filter((c) => matchesTerm(c, term)).slice(0, 8);
  }, [allChallenges, query]);

  const groupedResults = useMemo(() => {
    return results.reduce((acc, challenge) => {
      const key = challenge._category || "Autres";
      if (!acc[key]) acc[key] = [];
      acc[key].push(challenge);
      return acc;
    }, {});
  }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const goTo = (challenge) => {
    navigate(`/update-challenge/${challenge._index}`, {
      state: { ...challenge, _pathCategory: challenge._category },
    });
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const isIncomplete = (c) => !c.point || !c.level;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`relative rounded-2xl p-[1.5px] transition-all duration-300 ${
          open
            ? "bg-gradient-to-r from-primary-400 via-tertiary-400 to-primary-600 shadow-card"
            : "bg-neutral-200 dark:bg-secondary-500"
        }`}
      >
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3 dark:bg-secondary-700">
          <Icon name="Search" size="md" className="text-ink-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un challenge (verset, mot-clé, catégorie…)"
            className="flex-1 bg-transparent text-body-md text-ink placeholder:text-ink-muted focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-neutral-100 dark:hover:bg-secondary-600"
              aria-label="Effacer la recherche"
            >
              <Icon name="X" size="sm" />
            </button>
          ) : (
            <kbd className="hidden items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-caption font-medium text-ink-muted dark:border-secondary-500 dark:bg-secondary-800 md:inline-flex">
              <span className="text-body-sm leading-none">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[480px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-lifted dark:border-secondary-500 dark:bg-secondary-700">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <Icon name="SearchX" size="lg" className="text-ink-muted" />
              <p className="text-body-md font-medium text-ink">
                Aucun challenge trouvé
              </p>
              <p className="text-body-sm text-ink-muted">
                Essaie un autre mot-clé ou une autre catégorie.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="px-2 py-1">
                  <p className="px-3 pb-1.5 pt-2 text-caption font-semibold uppercase tracking-wide text-ink-muted">
                    {category}
                  </p>
                  <ul className="flex flex-col">
                    {items.map((c) => {
                      const flatIndex = results.indexOf(c);
                      const isActive = flatIndex === activeIndex;
                      return (
                        <li key={`${c._category}-${c._index}`}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            onClick={() => goTo(c)}
                            className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                              isActive
                                ? "bg-primary-50 dark:bg-secondary-600"
                                : "hover:bg-primary-50/50 dark:hover:bg-secondary-600"
                            }`}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-secondary-500 dark:text-primary-300">
                              <Icon name="Sparkles" size="sm" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate font-medium text-ink">
                                  {c.verse || "(sans titre)"}
                                </span>
                                {isIncomplete(c) && (
                                  <Badge variant="tertiary" size="sm" dot>
                                    À compléter
                                  </Badge>
                                )}
                              </span>
                              <span className="mt-0.5 block truncate text-body-sm text-ink-muted">
                                {c.challenge || c.verseText}
                              </span>
                            </span>
                            <Icon
                              name="ArrowRight"
                              size="sm"
                              className="mt-1 shrink-0 text-ink-muted"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-caption text-ink-muted dark:border-secondary-500 dark:bg-secondary-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-medium dark:border-secondary-400 dark:bg-secondary-700">
                  ↑↓
                </kbd>
                Naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-medium dark:border-secondary-400 dark:bg-secondary-700">
                  ↵
                </kbd>
                Ouvrir
              </span>
              <span className="hidden sm:flex sm:items-center sm:gap-1">
                <kbd className="rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-medium dark:border-secondary-400 dark:bg-secondary-700">
                  esc
                </kbd>
                Fermer
              </span>
            </div>
            <span>{results.length} résultat{results.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeSearch;
