import { ArrayTableBase, ArrayTableBaseProps, observer } from '@formlogic/render';


interface ArrayDrawerTableProps extends ArrayTableBaseProps{

}


const ArrayDrawerTable = observer((...restProps) => {


  const onAdd = () => {



  }


  return (
    <>
      <ArrayTableBase {...restProps} onAdd={onAdd} />
    </>
  );
});

export default ArrayDrawerTable;
