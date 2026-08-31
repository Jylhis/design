import { Tag } from "../Tag/Tag.jsx";
import { StatusBadge } from "../StatusBadge/StatusBadge.jsx";

export function ProjectCard({ title, description, tags = [], status, subtle = false, href, headingLevel = 3 }) {
  const TitleTag = href ? "a" : "span";
  const Heading = `h${headingLevel}`;
  return (
    <div className={"ds-card" + (subtle ? " ds-card--subtle" : "")}>
      <div className="ds-card__head">
        <Heading className="ds-card__title">
          <TitleTag href={href}>
            {title}
          </TitleTag>
        </Heading>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      {description ? <p className="ds-card__desc">{description}</p> : null}
      {tags.length ? (
        <div className="ds-card__tags">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}
