document.writeln(" <OBJECT  id='mysql' classid='clsid:9C579403-6745-4695-B14C-96212D319F18'");   
document.writeln(" codebase='JSDBC_MySQL.ocx#Version=1,0,0,000'");   
document.writeln(" WIDTH='0'   HEIGHT='0'>");  
document.writeln(" </OBJECT>"); 
//error message
var lasterr = ""; 
//Exec Falg
var execFlag;
/**
 * Connecte to mysql server 
 * provite:MySQL IP,PORT,DB Name,USER,Password,CharSet
 */
function connectMySQL()
{
 execFlag = mysql.connecte("172.16.129.25","3306","park","park","park","UTF-8");
 if(execFlag == 1)
  return 1;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Close already open Connection
 */
function closeMySQL()
{
 execFlag = mysql.close();
 if(execFlag == 1)
  return 1;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Exec Insert Into SQL statement
 * @param {Object} sql
 */
function insertMySQL(sql)
{
 execFlag = mysql.insertData(sql);
 if(execFlag == 1)
  return 1;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Exec DataBase Manager Language
 * @param {Object} sql
 */
function execDMLMySQL(sql)
{
 execFlag = mysql.execDML(sql);
 if(execFlag == 1)
  return 0;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Exec Select Data From DataBase
 * @param {Object} sql
 * @param {Object} cnum == Number of fields in SQL statement
 */
function selectMySQL(sql,cnum)
{
 var rs = mysql.selectData(sql,cnum);
 if(rs.length > 0)
 {
  var array = new Array();
  var DataSet = new Array();
  var rowsplit = '';//行间隔 ,注意，这并不是普通的'-',而是0x06 转换而来的，使用时拷贝过去即可
  var fieldsplit ='';//字段间隔,注意，这并不是普通的'|',而是0x05 转换而来的，使用时拷贝过去即可
  
  array = rs.split(rowsplit);
  for(var i = 0;i < array.length; i++)
  {
   var DataRow = array[i].split(fieldsplit);
   DataSet[i] = DataRow;
  }
  return DataSet;
 }
 else
 {
  lasterr = mysql.getLastError();
  return null;
 }
}
/**
 * Exec Delete SQL statement
 * @param {Object} sql
 */
function deleteMySQL(sql)
{
 execFlag = mysql.deleteData(sql);
 if(execFlag == 1)
  return 1;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Exec Update SQL statement
 * @param {Object} sql
 */
function updateMySQL(sql)
{
 execFlag = mysql.updateData(sql);
 if(execFlag == 1)
  return 1;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Exec Call Produce
 * @param {Object} proname == Produce Name
 * @param {Object} inparas == Produce IN Parameters
 * @param {Object} outparas == Produce OUT Parameters
 * @param {Object} cnum == Number of fields in OUT Parameters
 */
function callProduceMySQL(proname,inparas,outparas,cnum)
{
 var rs = mysql.execProduce(proname,inparas,outparas,cnum);
 if(rs.length == 0)
 {
  lasterr = mysql.getLastError();
  return null;
 }
 else
 {
  var array = new Array();
  var DataSet = new Array();
  
  var rowsplit = '';//行间隔 ,注意，这并不是普通的'-',而是0x06 转换而来的
  var fieldsplit ='';//字段间隔,注意，这并不是普通的'|',而是0x05 转换而来的
  
  array = rs.split(rowsplit);
  var DataRow = new Array();
  for(var i = 0;i < array.length; i++)
  {
   var fieldarray = array[i].split(fieldsplit);
   DataSet[i] = fieldarray;
  }
  return DataSet;
 }
}
/**
 * Exec Transcation
 * @param {Object} sql
 */
function execTranscationMySQL(sql)
{
 execFlag = mysql.execTranscation(sql);
 if(execFlag == 1)
  return 1;
 else
 {
  lasterr = mysql.getLastError();
  return 0;
 }
}
/**
 * Get Last Error Message if exec error from js
 */
function getLastErrorMySQL()
{
 return lasterr;
}
/**
 * Get Last Error Message if exec error from ocx
 */
function getLastErrorFromMySQL()
{
 var lasterrmysql = mysql.getLastError();
 return lasterrmysql;
}