CREATE TABLE links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  status ENUM('online', 'offline') DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
