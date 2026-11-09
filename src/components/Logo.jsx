import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
export default function Logo({isWhite=false}){return <Link to="/" className={`brand-logo ${isWhite?'brand-logo--light':''}`} aria-label="NOVA SPORT, ir à página inicial"><img src={logo} alt="NOVA SPORT" width="264" height="52" /></Link>;}
