import { Link } from "react-router-dom";
import { IConfig, IVideoConfigEntry } from "../api/interfaces";

interface IndexPageProps {
  config: IConfig;
}

export default function IndexPage({ config }: IndexPageProps) {
  return (
    <div>
      <ol>
        {config.videos.map((videoConfig: IVideoConfigEntry) => {
          const { slug } = videoConfig;
          return (
            <li key={slug}>
              <Link to={`/av/${slug}`}>{slug}</Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
