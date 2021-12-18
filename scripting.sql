/* {"openPrice":closingPrice,"closePrice":buyOrderPlacement,"breakPoint":currentBreakPoint,"ATR":currentATR,"percentage":currentPercentage,"balance":lastBalance} */
/* CREATE DATABASE BOT */
/*
CREATE TABLE BOT.Orders (
    Symbol varchar(255),
	Info varchar(255),
);


*/
/*INSERT INTO BOT.Orders (Symbol,Info) VALUES ('BTCUSDT', '{"openPrice":closingPrice,"closePrice":buyOrderPlacement,"breakPoint":currentBreakPoint,"ATR":currentATR,"percentage":currentPercentage,"balance":lastBalance}');*/
/*
UPDATE BOT.Balances SET allowedToTrade = true WHERE SYMBOL = 'BTCUSDT';
*/

/*
CREATE TABLE BOT.Balances (
    Symbol varchar(255),
	Balance varchar(255),
	allowedToTrade varchar(5) DEFAULT false
);
*/

SELECT * from BOT.Orders;
SELECT * from BOT.Balances;

/*
SET GLOBAL connect_timeout=28800;
SET GLOBAL interactive_timeout=28800;
SET GLOBAL wait_timeout=28800;
*/

/* SELECT @@global.wait_timeout, @@global.interactive_timeout, @@session.wait_timeout, @@session.interactive_timeout; */
/*
Alter TABLE BOT.Balances DROP COLUMN TotalBalance
/*
DESCRIBE BOT.Orders;
*/


DELETE FROM BOT.Orders;
DELETE FROM BOT.Balances;




