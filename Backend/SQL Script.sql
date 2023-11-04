
CREATE TABLE cartoes(
    ID_Cartao INT PRIMARY KEY
);

CREATE TABLE servico(
	ID_Servicos INT PRIMARY KEY,
    Nome_Servico VARCHAR(50),
    Saldo_Servico INT
);

CREATE SEQUENCE sequencia_compra START WITH 1 INCREMENT BY 1;

CREATE TABLE Compras (
    ID_Compra INT DEFAULT sequencia_compra.NEXTVAL PRIMARY KEY,
    ID_Cartao INT,
    ID_Servico INT,
    Data_Compra DATE,
    FOREIGN KEY (ID_Cartao) REFERENCES cartoes(ID_Cartao),
    FOREIGN KEY (ID_Servico) REFERENCES servico(ID_Servicos)
);

INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(1, 'Preenchimento Labial', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(2, 'Preenchimento Facial', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(3, 'Harmonização Facial', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(4, 'Limpeza de Pele', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(5, 'Micropigmentação', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(6, 'Rinomodelação', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(7, 'Depilação Laser', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(8, 'Manicure', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(9, 'Pedicure', 1);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(10, 'Kit Manicure', 6);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(11, 'Kit Pedicure', 6);
INSERT INTO servico (ID_Servicos, Nome_Servico, Saldo_Servico) VALUES(12, 'Kit Limpeza de Pele', 6);


SELECT * FROM Cartoes;
SELECT * FROM Compras;
SELECT * FROM Servico;
