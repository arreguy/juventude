-- Create indexes for better query performance

-- Indexes for membros table
CREATE INDEX idx_membros_nome ON membros(nome);
CREATE INDEX idx_membros_ativo ON membros(ativo);
CREATE INDEX idx_membros_created_at ON membros(created_at);
CREATE INDEX idx_membros_data_nascimento ON membros(data_nascimento);

-- Indexes for ministerios table
CREATE INDEX idx_ministerios_nome ON ministerios(nome);
CREATE INDEX idx_ministerios_ativo ON ministerios(ativo);
CREATE INDEX idx_ministerios_created_at ON ministerios(created_at);

-- Indexes for eventos table
CREATE INDEX idx_eventos_nome ON eventos(nome);
CREATE INDEX idx_eventos_ativo ON eventos(ativo);
CREATE INDEX idx_eventos_data_evento ON eventos(data_evento);
CREATE INDEX idx_eventos_created_at ON eventos(created_at);

-- Indexes for junction tables
CREATE INDEX idx_membro_ministerio_membro_id ON membro_ministerio(membro_id);
CREATE INDEX idx_membro_ministerio_ministerio_id ON membro_ministerio(ministerio_id);

CREATE INDEX idx_evento_ministerio_evento_id ON evento_ministerio(evento_id);
CREATE INDEX idx_evento_ministerio_ministerio_id ON evento_ministerio(ministerio_id);