import { tablesmith } from '../../src/module/tablesmith/tablesmithinstance';
import { TableParameter, TableParameterType } from '../../src/module/tablesmith/tstable';

let filename: string;
let simpleTable: string;

describe('Parsing Prompt', () => {
  beforeEach(() => {
    tablesmith.reset();
    filename = 'simpletable';
  });

  it('parsing correct', () => {
    simpleTable = '%varname%,\n@varname,default-value,Prompt\n:Start\n1,%varname%\n';
    const table = tablesmith.addTable(filename, simpleTable);
    const parameter = new TableParameter('varname', 'default-value', 'Prompt', false, []);
    const result = table.getParameter('varname');
    expect(result).toEqual(parameter);
    expect(result?.type).toBe(TableParameterType.PROMPT);
  });
});

describe('Parsing List', () => {
  beforeEach(() => {
    tablesmith.reset();
    filename = 'simpletable';
  });

  it('parsing correct', () => {
    simpleTable = '%varname%,\n@varname,1,Prompt,1,2,3\n:Start\n1,%varname%\n';
    const table = tablesmith.addTable(filename, simpleTable);
    const parameter = new TableParameter('varname', '1', 'Prompt', false, ['1', '2', '3']);
    const result = table.getParameter('varname');
    expect(result).toEqual(parameter);
    expect(result?.type).toBe(TableParameterType.LIST);
  });

  it('parameter type LIST default not integer error', () => {
    simpleTable = '%varname%,\n@varname,nonumber,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });

  it('parameter type LIST default 0, first param is numbered 1', () => {
    simpleTable = '%varname%,\n@varname,0,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });

  it('parameter type LIST default 4, max param 3', () => {
    simpleTable = '%varname%,\n@varname,4,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });
});

describe('Parsing MultiList', () => {
  beforeEach(() => {
    tablesmith.reset();
    filename = 'simpletable';
  });

  it('parsing correct', () => {
    simpleTable = '%varname%,\n@*varname,111,Prompt,1,2,3\n:Start\n1,%varname%\n';
    const table = tablesmith.addTable(filename, simpleTable);
    const parameter = new TableParameter('varname', '111', 'Prompt', true, ['1', '2', '3']);
    const result = table.getParameter('varname');
    expect(result).toEqual(parameter);
    expect(result?.type).toBe(TableParameterType.MULTI_LIST);
  });

  it('setDefaultValue([]) all unset', () => {
    simpleTable = '%varname%,\n@*varname,111,Prompt,1,2,3\n:Start\n1,%varname%\n';
    const table = tablesmith.addTable(filename, simpleTable);
    const result = table.getParameter('varname');
    result?.setDefaultValue([]);
    expect(result?.defaultValue).toEqual('000');
  });

  it('setDefaultValue([1,3]) sets 1 and 3 lets 2 unset', () => {
    simpleTable = '%varname%,\n@*varname,111,Prompt,1,2,3\n:Start\n1,%varname%\n';
    const table = tablesmith.addTable(filename, simpleTable);
    const result = table.getParameter('varname');
    result?.setDefaultValue(['1', '3']);
    expect(result?.defaultValue).toEqual('101');
  });

  it('default not integer', () => {
    simpleTable = '%varname%,\n@*varname,nonumber,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });

  it('default not three digit binary, but two', () => {
    simpleTable = '%varname%,\n@*varname,11,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });

  it('default not three digit binary, but four', () => {
    simpleTable = '%varname%,\n@*varname,1010,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });

  it('default not three digit but not 0s and 1s', () => {
    simpleTable = '%varname%,\n@*varname,002,Prompt,1,2,3\n:Start\n1,%varname%\n';
    expect(() => {
      tablesmith.addTable(filename, simpleTable);
    }).toThrowError();
  });
});
