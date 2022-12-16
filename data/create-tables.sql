CREATE TABLE public.users
(
    "userID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(40) COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    "decksNum" integer,
    joined timestamp without time zone,
    profile text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY ("userID"),
    CONSTRAINT uniqueusername UNIQUE (username),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE public.ratings
(
    "deckID" integer NOT NULL,
    rating numeric NOT NULL,
    "userID" integer NOT NULL,
    CONSTRAINT ratings_pkey PRIMARY KEY ("userID", "deckID")
)

TABLESPACE pg_default;

ALTER TABLE public.ratings
    OWNER to postgres;

CREATE TABLE public.login
(
    "loginID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT login_pkey PRIMARY KEY ("loginID"),
    CONSTRAINT login_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE public.login
    OWNER to postgres;

CREATE TABLE public.entrys
(
    "cardName" text COLLATE pg_catalog."default" NOT NULL,
    type character varying COLLATE pg_catalog."default",
    price numeric,
    cmc numeric,
    modal character varying COLLATE pg_catalog."default",
    "imageUrl" character varying COLLATE pg_catalog."default",
    "imageUrl2" character varying COLLATE pg_catalog."default",
    color character varying COLLATE pg_catalog."default",
    "producedMana" character varying COLLATE pg_catalog."default",
    legal character varying COLLATE pg_catalog."default",
    mana character varying COLLATE pg_catalog."default",
    "cardArt" character varying COLLATE pg_catalog."default",
    oracle_text text COLLATE pg_catalog."default",
    "isPartner" boolean,
    artist character varying COLLATE pg_catalog."default",
    CONSTRAINT entrys_pkey PRIMARY KEY ("cardName")
)

TABLESPACE pg_default;

ALTER TABLE public.entrys
    OWNER to postgres;