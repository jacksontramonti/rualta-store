import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
export default function Logo({isWhite=false}){return <Link to="/" className={`brand-logo ${isWhite?'brand-logo--light':''}`} aria-label="RUALTA, ir à página inicial"><img src={logo} alt="RUALTA" width="190" height="45" /></Link>;}
