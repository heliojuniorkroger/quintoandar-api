CREATE TABLE Users (
    id varchar(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE UserProperties (
    propertyId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE PropertyVisits (
    id varchar(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    propertyId VARCHAR(255) NOT NULL,
    scheduledDate DATETIME NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    status ENUM('scheduled', 'cancelled', 'done') NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id),
    PRIMARY KEY (id)
);