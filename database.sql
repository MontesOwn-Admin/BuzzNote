BEGIN TRANSACTION;
DROP TABLE IF EXISTS averages;
DROP TABLE IF EXISTS frames;
DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS boxes;
DROP TABLE IF EXISTS hives;

CREATE TABLE hives (
    hive_id serial NOT NULL,
    hive_name varchar(100) NOT NULL,
    num_boxes int NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_hive PRIMARY KEY (hive_id)
);

CREATE TABLE inspections (
    inspection_id serial NOT NULL,
    hive_id int NOT NULL,
    inspection_date DATE,
    start_time varchar(20) NOT NULL,
    weather_temp int,
    weather_condition varchar(50),
    bee_temperament varchar(20),
    bee_population varchar(20),
    drone_population varchar(20),
    laying_pattern varchar(20),
    hive_beetles varchar(20),
    other_pests varchar(20),
    brood_eggs BOOLEAN DEFAULT FALSE,
    brood_larva BOOLEAN DEFAULT FALSE,
    brood_capped BOOLEAN DEFAULT FALSE,
    queen_spotted BOOLEAN DEFAULT FALSE,
    notes text,
    CONSTRAINT pk_inspection PRIMARY KEY (inspection_id),
    CONSTRAINT fk_hive FOREIGN KEY (hive_id) REFERENCES hives (hive_id)
);

CREATE TABLE boxes (
    box_id serial NOT NULL,
    hive_id int NOT NULL,
    box_name varchar(50),
    num_frames int NOT NULL,
    box_type varchar(50),
    overwinter BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_box PRIMARY KEY (box_id),
    CONSTRAINT fk_hive FOREIGN KEY (hive_id) REFERENCES hives (hive_id)
);

CREATE TABLE frames (
    frame_id serial NOT NULL,
    box_id int NOT NULL,
    inspection_id int NOT NULL,
    box_name varchar(50) NOT NULL,
    frame_number varchar(20) NOT NULL,
    drawn_comb BOOLEAN DEFAULT FALSE,
    honey BOOLEAN DEFAULT FALSE,
    nectar BOOLEAN DEFAULT FALSE,
    brood BOOLEAN DEFAULT FALSE,
    queen_cells BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_frame PRIMARY KEY (frame_id),
    CONSTRAINT fk_box FOREIGN KEY (box_id) REFERENCES boxes (box_id),
    CONSTRAINT fk_inspection FOREIGN KEY (inspection_id) REFERENCES inspections (inspection_id)
);

CREATE TABLE averages (
    average_id serial NOT NULL,
    inspection_id int NOT NULL,
    box_name varchar(50) NOT NULL,
    num_frames int,
    honey varchar(50),
    nectar varchar(50),
    brood varchar(50),
    queen_cells varchar(50),
    drawn_comb varchar(50),
    queen_spotted varchar(50),
    CONSTRAINT pk_average PRIMARY KEY (average_id),
    CONSTRAINT fk_inspection FOREIGN KEY (inspection_id) REFERENCES inspections (inspection_id)
);

COMMIT TRANSACTION;