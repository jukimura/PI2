CREATE TABLE Cartao(
Id_cartao number(07) CONSTRAINT pk_id_cartao PRIMARY KEY
);

SELECT * FROM Cartao;

SELECT * FROM Cartao WHERE Id_cartao = 1;

INSERT INTO Cartao VALUES(Id);

CREATE TABLE Servico(
Id_servico number(03) CONSTRAINT pk_id_servico PRIMARY KEY,
Nome_servico varchar2(50) NOT NULL,
Saldo_servico number(02) NOT NULL
);

CREATE SEQUENCE SEQUENCE_ID_SERVICO
    MINVALUE 1
    MAXVALUE 999
    INCREMENT BY 1;
   
CREATE OR REPLACE TRIGGER TRIGGER_ID_SERVICO
    BEFORE INSERT ON Servico
    FOR EACH ROW
BEGIN
    :NEW.Id_servico := SEQUENCE_ID_SERVICO.nextval;
END;

INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Preenchimento Labial', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Preenchimento Facial', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Harmonização Facial', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Limpeza de Pele', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Micropigmentação', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Rinomodelação', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Depilação Laser', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Manicure', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Pedicure', 1);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Kit Manicure', 6);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Kit Pedicure', 6);
INSERT INTO Servico (Nome_Servico, Saldo_Servico) VALUES('Kit Limpeza de Pele', 6);


SELECT * FROM Servico;

SELECT Nome_servico FROM Servico WHERE Id_servico = 1;


CREATE TABLE Recompensa(
Id_recompensa number(03) CONSTRAINT pk_id_recompensa PRIMARY KEY,
Nome_recompensa varchar2(50) NOT NULL,
Qtd_minima_usos number(02) NOT NULL
);

CREATE SEQUENCE SEQUENCE_ID_RECOMPENSA
    MINVALUE 1
    MAXVALUE 999
    INCREMENT BY 1;
   
CREATE OR REPLACE TRIGGER TRIGGER_ID_RECOMPENSA
    BEFORE INSERT ON Recompensa
    FOR EACH ROW
BEGIN
    :NEW.Id_recompensa := SEQUENCE_ID_RECOMPENSA.nextval;
END;

INSERT INTO Recompensa (Nome_recompensa, Qtd_minima_usos)VALUES ('Massagem relaxante', 3);
INSERT INTO Recompensa (Nome_recompensa, Qtd_minima_usos)VALUES ('Massagem redutora ', 4);
INSERT INTO Recompensa (Nome_recompensa, Qtd_minima_usos)VALUES ('Drenagem linfática', 5);

SELECT * FROM Recompensa;

SELECT * FROM Recompensa WHERE Qtd_minima_usos = 3;

CREATE TABLE Bonificacao(
Id_bonificacao number(03) CONSTRAINT pk_id_bonificacao PRIMARY KEY,
fk_id_cartao number(07),
fk_id_recompensa number(03),
FOREIGN KEY (fk_id_cartao) REFERENCES Cartao(Id_cartao),
FOREIGN KEY (fk_id_recompensa) REFERENCES Recompensa(Id_recompensa)
);

CREATE SEQUENCE SEQUENCE_ID_BONIFICACAO
    MINVALUE 1
    MAXVALUE 999
    INCREMENT BY 1;
   
CREATE OR REPLACE TRIGGER TRIGGER_ID_BONIFICACAO
    BEFORE INSERT ON Bonificacao
    FOR EACH ROW
BEGIN
    :NEW.Id_bonificacao := SEQUENCE_ID_BONIFICACAO.nextval;
END;

SELECT * FROM Bonificacao;

CREATE TABLE Compra(
Id_compra number(05) CONSTRAINT pk_id_compra PRIMARY KEY,
Data_compra DATE NOT NULL,
Data_uso DATE,
Status_compra varchar2(20) NOT NULL,
fk_id_cartao number(07),
fk_id_servico number(03),
FOREIGN KEY (fk_id_cartao) REFERENCES Cartao(Id_cartao),
FOREIGN KEY (fk_id_servico) REFERENCES Servico(Id_servico)
);

CREATE SEQUENCE SEQUENCE_ID_COMPRA
    MINVALUE 1
    MAXVALUE 99999
    INCREMENT BY 1;
   
CREATE OR REPLACE TRIGGER TRIGGER_ID_COMPRA
    BEFORE INSERT ON Compra
    FOR EACH ROW
BEGIN
    :NEW.Id_compra := SEQUENCE_ID_COMPRA.nextval;
END;

SELECT * FROM Compra;

SELECT * FROM Compra WHERE fk_Id_cartao = 1;

SELECT * FROM COMPRA WHERE fk_Id_cartao = 1 AND Status_compra = 'Disponível';
SELECT * FROM COMPRA WHERE fk_Id_cartao = 1 AND Status_compra = 'Usado';
