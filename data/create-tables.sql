CREATE TABLE login
(
    login_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    hash character varying(100) NOT NULL,
    email text NOT NULL,
    CONSTRAINT login_pkey PRIMARY KEY (login_id),
    CONSTRAINT login_email_key UNIQUE (email)
);

CREATE TABLE users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(40),
    email text NOT NULL,
    decksNum integer,
    joined timestamp without time zone,
    profile text,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT uniqueusername UNIQUE (username),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE decks 
(
    id integer NOT NULL
        GENERATED ALWAYS AS IDENTITY
        ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    name character varying(40) NOT NULL,
    commander character varying(40) NOT NULL,
    created timestamp without time zone,
    partner character varying(40),
    description text,
    imageUrl character varying(100),
    imageUrl2 character varying(100),
    partnerImageUrl character varying(100),
    color character varying(40),
    artist character varying(40),
    averageRating numeric,
    CONSTRAINT decks_pkey PRIMARY KEY (id),
    CONSTRAINT users_fkey FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE ratings
(
    deck_id integer NOT NULL,
    rating numeric NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT ratings_pkey PRIMARY KEY (user_id, deck_id),
    CONSTRAINT decks_fkey FOREIGN KEY (deck_id) REFERENCES decks (id),
    CONSTRAINT users_fkey FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE cards
(
    cardName text NOT NULL, 
    deck_id integer NOT NULL,
    quantity integer NOT NULL, 
    cardStatus character varying(40),
    CONSTRAINT cards_pkey PRIMARY KEY (cardName, deck_id)
);

CREATE TABLE entrys
(
    cardName text NOT NULL,
    type character varying,
    price numeric,
    cmc numeric,
    modal character varying,
    imageUrl character varying,
    imageUrl2 character varying,
    color character varying,
    producedMana character varying,
    legal character varying,
    mana character varying,
    cardArt character varying,
    oracle_text text,
    isPartner boolean,
    artist character varying,
    CONSTRAINT entrys_pkey PRIMARY KEY (cardName)
);