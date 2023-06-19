import { Button, Text } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { QuestionMaintain } from '@/pages/account/components/QuestionMaintain';
import { useQuestionStore } from '@/store';
import { ROUTE_PATH } from '@/router';
export default function Question() {
  const { setType, type } = useQuestionStore((state) => state);
  const tabs = [
    {
      label: '默认',
      value: 1,
    },
    {
      label: '自定义',
      value: 2,
    },
  ];
  const tabChange = (value: number) => {
    setType(value);
  };
  return (
    <LayoutThird title='智能隐私备份' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-4'>
        <div className='flex mb-4'>
          {tabs.map((item, index) => {
            return (
              <Button
                key={index}
                className={`w-20 mr-2 text-14px ${
                  type === item.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                auto
                onClick={() => {
                  tabChange(item.value);
                }}>
                {item.label}
              </Button>
            );
          })}
        </div>
        <Text className='text-14px mb-6'>
          {type === 1 ? (
            <>
              <span>
                智能隐私备份是一种自托管的私钥备份管理，由用户的个人隐私信息，通过MPC-SSS计算生成多个分片，保存在分布式存储网络上，所有计算都在本地完成，所有数据保存在用户自己的数字空间，确保用户数据安全。
              </span>
              <br />
              <span>
                用户务必正确填写以下表格，可以留空不填（数据跟个人信息同步）。如果个人信息有变更，需要重新做账户维护，防止账户丢失。
              </span>
            </>
          ) : (
            '智能隐私问答的目标是帮助用户使用自己印象最深刻的并且是独一无二的事件或记忆作为密码来加密分片数据。这样的记忆不会随着时间的流逝而遗忘或改变，是用户自己生命中独特的体验和记忆。结合我们的技术，用户不用费劲去记忆任何密码，也不用额外保存任何数据，就可以恢复账户。用户唯一要做的就是做最真实的自己。请放心，我们采用零知识证明（zkp）技术，不保存任何用户隐私。'
          )}
        </Text>
        <div>
          <QuestionMaintain type={type} />
        </div>
      </div>
    </LayoutThird>
  );
}
