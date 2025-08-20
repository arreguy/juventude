-- Create indexes for better query performance

-- Indexes for membro table (singular)
CREATE INDEX idx_membro_nome ON membro(nome);
CREATE INDEX idx_membro_ativo ON membro(ativo);
CREATE INDEX idx_membro_data_nascimento ON membro(data_nascimento);

-- Indexes for ministerio table (singular)
CREATE INDEX idx_ministerio_nome ON ministerio(nome);

-- Indexes for evento table (singular)
CREATE INDEX idx_evento_categoria ON evento(categoria);
CREATE INDEX idx_evento_data ON evento(data);

-- Indexes for junction tables
CREATE INDEX idx_membro_ministerio_membro_id ON membro_ministerio(membro_id);
CREATE INDEX idx_membro_ministerio_ministerio_id ON membro_ministerio(ministerio_id);

CREATE INDEX idx_evento_ministerio_evento_id ON evento_ministerio(evento_id);
CREATE INDEX idx_evento_ministerio_ministerio_id ON evento_ministerio(ministerio_id);