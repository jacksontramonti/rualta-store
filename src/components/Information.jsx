import { Link } from 'react-router-dom';
export default function Information({title,informations=[]}){return <div className="footer-column"><h3>{title}</h3>{informations.map(({text,link})=><Link key={`${link}-${text}`} to={link}>{text}</Link>)}</div>;}
