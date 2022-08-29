const Notification = ({ message }) => {
	if (message === null) return null
	
  const styles = message.includes("Information") ? "error-message" : "success-message"

  return <div className={styles}>{message}</div>
}

export default Notification