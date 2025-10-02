import styles from "./PageNotFound.module.css"
import Button from "@mui/material/Button"
import { Link } from "react-router"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <div className={styles.buttonContainer}>
      <Button component={Link} to="/" variant="contained" color="primary" size="large">
        Вернуться на главную
      </Button>
    </div>
  </>
)
