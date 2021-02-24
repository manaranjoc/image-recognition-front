import {NavLink} from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to='/' className={styles.link} activeClassName={styles.linkActive} exact>
        Label
      </NavLink>
      <NavLink to='/bounding-box' className={styles.link} activeClassName={styles.linkActive}>
        Tag
      </NavLink>
    </nav>
  )
}

export default Navbar;