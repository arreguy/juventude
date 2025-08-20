-- Insert seed data for ministérios
INSERT INTO ministerios (nome, ativo) VALUES
('LOUVOR', true),
('TEATRO', true),
('PRODUCAO', true),
('SALVAVIDAS', true),
('INTERCESSAO', true),
('RECEPCAO', true),
('OPERACIONAL', true),
('FOTOGRAFIA', true),
('CRIATIVO', true);

-- Add constraints to ensure data integrity
ALTER TABLE membros ADD CONSTRAINT chk_idade CHECK (idade >= 0 AND idade <= 120);
ALTER TABLE membros ADD CONSTRAINT chk_data_nascimento CHECK (data_nascimento <= CURRENT_DATE);
ALTER TABLE eventos ADD CONSTRAINT chk_data_evento CHECK (data_evento >= CURRENT_TIMESTAMP - INTERVAL '1 year');