import { Button, Text, Card } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { QuestionMaintain } from '@/components/question/QuestionMaintain';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
export default function AccountQuestion() {
  const nav = useNavigate();
  return (
    <LayoutThird title='智能隐私备份' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-4'>
        <Text className='text-14px mb-6'>
          智能隐私问答的目标是帮助用户使用自己印象最深刻的并且是独一无二的事件或记忆作为密码来加密分片数据。这样的记忆不会随着时间的流逝而遗忘或改变，是用户自己生命中独特的体验和记忆。结合我们的技术，用户不用费劲去记忆任何密码，也不用额外保存任何数据，就可以恢复账户。用户唯一要做的就是做最真实的自己。请放心，我们采用零知识证明（zkp）技术，不保存任何用户隐私。
        </Text>
        <div>
          <QuestionMaintain />
        </div>
      </div>
    </LayoutThird>
  );
}
