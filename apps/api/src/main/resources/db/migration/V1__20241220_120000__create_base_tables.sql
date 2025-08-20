-- Create base tables with proper naming and structure
-- Following PostgreSQL naming conventions (snake_case)

-- Ministérios table
CREATE TABLE ministerios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INTEGER NOT NULL DEFAULT 0
);

-- Membros table
CREATE TABLE membros (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    idade INTEGER,
    data_nascimento DATE,
    telefone VARCHAR(20),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INTEGER NOT NULL DEFAULT 0
);

-- Eventos table
CREATE TABLE eventos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_evento TIMESTAMP NOT NULL,
    local VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INTEGER NOT NULL DEFAULT 0
);

-- Junction table for many-to-many relationship between membros and ministerios
CREATE TABLE membro_ministerio (
    membro_id BIGINT NOT NULL,
    ministerio_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    PRIMARY KEY (membro_id, ministerio_id),
    CONSTRAINT fk_membro_ministerio_membro 
        FOREIGN KEY (membro_id) REFERENCES membros(id) ON DELETE CASCADE,
    CONSTRAINT fk_membro_ministerio_ministerio 
        FOREIGN KEY (ministerio_id) REFERENCES ministerios(id) ON DELETE CASCADE
);

-- Junction table for many-to-many relationship between eventos and ministerios
CREATE TABLE evento_ministerio (
    evento_id BIGINT NOT NULL,
    ministerio_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    PRIMARY KEY (evento_id, ministerio_id),
    CONSTRAINT fk_evento_ministerio_evento 
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    CONSTRAINT fk_evento_ministerio_ministerio 
        FOREIGN KEY (ministerio_id) REFERENCES ministerios(id) ON DELETE CASCADE
);