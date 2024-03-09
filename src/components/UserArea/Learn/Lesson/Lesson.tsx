'use client'
import { ILessonState, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from '@/lib/validation/enforceTypes'
import React, { useState } from 'react'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/Chat/ChatWithEli'
import { responsiveFont, sizing, spacing } from '@/lib/constants'

import { getNextMessage } from '@/lib/chat/Eli/eli'
import NeuralNetwork from './NeuralNetwork'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'


export default function LessonPage({ initialLessonState }: { initialLessonState: ILessonState }) {
    const [lessonState, setLessonState] = useState<ILessonState>(initialLessonState);
    console.log("LessonState: ", lessonState)
    const currentSubject = lessonState.metadata.subjects[lessonState.metadata.subjects.length - 1];
    const {
        oldMessages, newMessages, metadata
    } = lessonState;
    const {
        knowledgePointChain,
    } = metadata;
    // const ems = knowledgePointChain.map(kp => kp.vectorEmbedding);
    // const twoDCoOrds = getTwoDCoOrdinatesOfEmbeddings(ems);
    // const knowledgePointsWithTwoDCoOrds: IKnowledge[] = knowledgePointChain.map((kp, index) => {
    //     return { ...kp, TwoDCoOrdinates: twoDCoOrds[index] };
    // })

    //TODO: KNOWLEDGEPOINT TOOLTIPS OF POINTSINSOLITUDE. i need a DAMN BREAK
    async function updateState(formData?: FormData, explicitState?: IMessagesEndpointResponsePayload, action?: "UNDERSTOOD" | 'ENDLESSON') {
        try {
            console.log("UpdateState called")
            console.log("UpdateState called with formData: ", formData)
            if (!formData && !explicitState && !action) throw new Error("No data was provided to updateState");
            //if there's an action, use it
            if (action) {
                //PROD:
                // const payload: IMessagesEndpointSendPayload = {
                //     messages: [...lessonState.newMessages], //this has been updated for new and old msgs. They will only say understood if theyre at the last of the new messages.
                //     metadata: {
                //         ...metadata,
                //         action
                //     }
                // }
                // const nextState: IMessagesEndpointResponsePayload | string = await getNextMessage(payload);

                //DEV:
                const nextState: any = await new Promise<IMessagesEndpointResponsePayload | {
                    error: string
                }>((resolve, reject) => {
                    setTimeout(() => {
                        resolve({
                            newMessages: [
                                {
                                    splitResponse: {
                                        text: '[Wave-particle duality] is a fundamental concept in quantum mechanics.',
                                        active: true
                                    },
                                    role: 'eli',
                                    eliResponseType: 'General'
                                },
                            ],
                            metadata: {
                                lessonID: '65dbe7799c9c2a30ecbe6193',
                                threads: [
                                    [
                                        {
                                            splitResponse: {
                                                text: 'This means that electrons can behave like particles in some situations and like waves in others.',
                                                active: false
                                            },
                                            role: 'eli',
                                            eliResponseType: 'General'
                                        },
                                        {
                                            splitResponse: {
                                                text: 'The wavelength of an electron can be calculated using the [de Broglie wavelength equation].',
                                                active: false
                                            },
                                            role: 'eli',
                                            eliResponseType: 'General'
                                        },
                                        {
                                            splitResponse: {
                                                text: 'Understanding this duality helps explain various phenomena in the microscopic world.',
                                                active: false
                                            },
                                            role: 'eli',
                                            eliResponseType: 'General'
                                        }
                                    ]
                                ],
                                subjects: ['\nDe-brogile equation and wave-like behaviour\n'],
                                knowledgePointChain: [
                                    {
                                        confidence: 5,
                                        lessonId: '65dbe7799c9c2a30ecbe6193',
                                        pointInSolitude: 'Electrons exhibit wave-like behavior due to wave-particle duality.',
                                        pointInChain: '',
                                        source: 'offered',
                                        TwoDCoOrdinates: [192.142, 31.1415],
                                        vectorEmbedding: [
                                            -0.022827767, 0.0018153265, -0.037418827, 0.05640204,
                                            0.018287312, 0.054166034, -0.0005283413, 0.050606683,
                                            0.008151144, 0.0446288, 0.004771471, -0.001528696,
                                            0.016712982, 0.033243436, 0.00013609602, 0.046956066,
                                            -0.01811619, -0.0023201385, 0.009063798, 0.03157784,
                                            -0.019450946, -0.017876618, 0.028908327, -0.00036488348,
                                            0.012024221, -0.025348974, -0.020329375, 0.0075408067,
                                            0.004754359, 0.02206342, 0.013427427, -0.01878927,
                                            0.026147546, -0.018766455, -0.051884398, 0.05370971,
                                            -0.02788159, 0.0047400985, -0.023078747, 0.020751478,
                                            -0.024527585, -0.019895865, -0.03089335, 0.045199208,
                                            -0.0331978, 0.0068277954, -0.04380741, -0.06128474,
                                            0.044218104, 0.044240918, 0.032034166, 0.035479438,
                                            0.050789215, -0.029912246, -0.020511907, -0.010472708,
                                            0.010866291, 0.041343242, -0.0084249405, -0.002026378,
                                            0.040704384, -0.0019893013, -0.007523694, 0.039084423,
                                            -0.010814954, -0.030710818, -0.045085125, -0.016085533,
                                            0.0006887688, 0.0032969639, 0.027927224, 0.0064570294,
                                            -0.042712223, 0.04136606, 0.03810332, -0.036871236,
                                            -0.01435149, -0.054896157, 0.011488036, 0.03954075,
                                            0.0017725459, -0.042347163, 0.01096326, -0.020158254,
                                            -0.016655942, 0.02888551, 0.034794945, -0.01998713,
                                            -0.032285146, -0.012902651, 0.04040777, 0.06712573,
                                            -0.026352894, 0.010512637, -0.020568946, 0.021413153,
                                            0.040019892, -0.007113, -0.067901485, -0.002683774,
                                        ]
                                    },
                                    {
                                        confidence: 5,
                                        lessonId: '65dbe7799c9c2a30ecbe6193',
                                        pointInSolitude: 'Electrons can act as waves in quantum mechanics.',
                                        pointInChain: '',
                                        source: 'offered',
                                        TwoDCoOrdinates: [32.642, 35.3415],
                                        vectorEmbedding: [
                                            -0.027314743, 0.029712684, -0.060951333, 0.048351236, 0.027096748,
                                            0.026072172, -0.05367031, 0.059294574, -0.012567397, 0.024262816,
                                            0.00030672541, 0.004599689, -0.0075044692, 0.025287392, 0.020284412,
                                            0.026115771, -0.042552575, -0.0047114114, 0.015314131, 0.052536733,
                                            0.0045342906, -0.015543026, 0.03457397, 0.004733211, 0.010164006,
                                            -0.048438434, -0.020556904, 0.058291797, 0.024720605, 0.021952072,
                                            0.03071546, -0.031849034, -0.0069594826, -0.008180253, -0.038040083,
                                            0.021995671, -0.027336542, -0.014758245, -0.01326498, 0.00090604066,
                                            -0.010414699, -0.009357424, -0.041353606, 0.055937454, -0.030453866,
                                            -0.014605648, -0.041724194, -0.024764204, 0.054149896, 0.041985787,
                                            0.040568825, 0.04059062, 0.020840298, 0.0077824127, -0.02363063,
                                            -0.018856546, -0.00994601, 0.018573152, 0.028077723, -0.004286322,
                                            0.014376754, 0.026486361, 0.0003099613, 0.031042453, -0.037189905,
                                            0.011989712, -0.026856953, -0.02363063, -0.013384878, 0.031282246,
                                            0.013548374, 0.009302926, -0.052100744, 0.051359564, 0.012087809,
                                            -0.025178393, -0.0055915653, -0.025178393, -0.0076679653, 0.004531566,
                                            0.01451845, -0.03359299, 0.0032208725, -0.054062698, -0.019368833,
                                            0.060384545, -0.0052236994, -0.012796292, -0.06962752, -0.03782209,
                                            0.022933047, 0.054716684, -0.033941783, 0.027074948, -0.020273512,
                                            0.036317926, 0.040983014, -0.014431252, -0.028753508, -0.03363659,
                                        ]
                                    },
                                    {
                                        confidence: 4,
                                        lessonId: '65dbe7799c9c2a30ecbe6193',
                                        pointInSolitude: 'Electrons can exhibit wave-like behavior in certain situations.',
                                        pointInChain: '',
                                        source: 'offered',
                                        TwoDCoOrdinates: [41.842, 3.8415],
                                        vectorEmbedding: [
                                            -0.029410908, 0.021849506, -0.050965812, 0.060343914,
                                            0.009052815, 0.04964011, -0.0055575077, 0.029779157,
                                            0.019910054, 0.06657962, 0.01894033, 0.008175152,
                                            0.029361807, 0.014410853, 0.015233279, 0.060049314,
                                            -0.03378081, 0.0090159895, -0.014337203, 0.03996741,
                                            0.0014522863, -0.0033388007, 0.022806956, 0.020327404,
                                            -0.0061282953, -0.020597454, -0.026366707, 0.019811856,
                                            0.02232823, 0.025703857, 0.023162931, -0.03218506,
                                            -0.00088303303, -0.04433731, -0.07860912, 0.05425551,
                                            -0.01795833, 0.0019916194, -0.023739856, 0.010832691,
                                            -0.0150123285, -0.017369129, -0.04222601, 0.061473217,
                                            0.0014008847, 0.003212982, -0.032356907, -0.04941916,
                                            0.03812616, 0.052978914, 0.03135036, 0.055483013,
                                            0.03910816, 0.009267627, -0.018019704, -0.024009906,
                                            0.01879303, 0.05209511, 0.027250506, -0.013441129,
                                            0.036628608, -0.0002873118, 0.02318748, 0.04666956,
                                            -0.027127756, 0.01999598, -0.056514114, -0.028453456,
                                            -0.004259426, 0.02161628, 0.013023778, -0.0020453224,
                                            -0.03913271, 0.046620462, 0.03272516, -0.016227555,
                                            -0.0032897007, -0.054550115, 0.022831505, 0.029779157,
                                            0.02056063, -0.04612946, -0.01061174, -0.04092486,
                                            -0.0045724385, 0.049198214, 0.012986953, -0.015687454,
                                            -0.03856806, -0.019713655, 0.016203005, 0.05238971,
                                            -0.027815158, 0.03576936, -0.02470958, 0.02242643,
                                            0.010581053, -0.028036106, -0.03373171, 0.013195628,
                                        ]
                                    },
                                    {
                                        confidence: 2,
                                        lessonId: '65dbe7799c9c2a30ecbe6193',
                                        pointInSolitude: 'Electrons have wave-like behavior, described by de Broglie equation.',
                                        pointInChain: '',
                                        source: 'offered',
                                        TwoDCoOrdinates: [43.029, 14.3415],
                                        vectorEmbedding: [
                                            -0.02821991, 0.01956654, -0.049869873, 0.03256313, 0.011883228,
                                            0.040301558, -0.021749172, 0.011420245, -0.005249895, 0.05507292,
                                            -0.0031995426, 0.00096179184, -0.0068786032, -0.017086273, -0.0061510587,
                                            0.042550333, -0.0152012715, 0.004056612, 0.008526602, 0.04656285,
                                            0.007606148, -0.011486385, 0.02429558, 0.025993183, 0.009612407,
                                            -0.017306741, -0.024670374, 0.018353965, 0.016237471, 0.022190109,
                                            0.017251624, -0.027492365, 0.007446308, -0.028859267, -0.04393928,
                                            0.037876412, -0.021683032, -0.004946752, -0.028308097, 0.0076006358,
                                            -0.018960252, -0.038163017, -0.059438184, 0.035517402, -0.02128619,
                                            0.021649962, -0.04704788, -0.04704788, 0.055381574, 0.027778974,
                                            0.016942969, 0.038052786, 0.04704788, -0.003723154, -0.026610494,
                                            -0.009838386, 0.04656285, 0.05533748, 0.009094307, 0.0025023124,
                                            0.052912332, 0.021021629, -0.012654866, 0.013702089, -0.034459155,
                                            -0.01662329, -0.03809688, -0.033422954, -0.026478212, 0.011927322,
                                            0.006217199, 0.02718371, -0.04490934, 0.01386744, -0.0076502413,
                                            -0.036663838, -0.03234266, -0.06569948, 0.020591715, 0.028749034,
                                            0.021175956, -0.043784954, -0.002968051, -0.04199916, -0.03855986,
                                            0.03139465, 0.04907619, -0.012676912, -0.040257465, -0.0054290257,
                                            -0.0021123595, 0.07156393, -0.050575368, 0.029476577, -0.006101453,
                                            0.012555655, 0.037060678, -0.006283339, -0.018155543, -0.020029522,
                                        ]
                                    },
                                    {
                                        confidence: 2,
                                        lessonId: '65dbe7799c9c2a30ecbe6193',
                                        pointInSolitude: 'Electrons behave like waves, explaining phenomena in the microscopic world.',
                                        pointInChain: '',
                                        source: 'offered',
                                        TwoDCoOrdinates: [23.142, 13.1415],
                                        vectorEmbedding: [
                                            -0.02287109, 0.019203713, -0.06841323, 0.038051803,
                                            0.004867608, 0.03009471, -0.025916124, 0.03789622,
                                            -0.018147955, 0.018870316, -0.019414866, 0.014136068,
                                            -0.017414479, -0.018970335, 0.018570257, 0.036207,
                                            -0.04549769, 0.019414866, 0.012457965, 0.04036336,
                                            0.02491593, -0.0056816544, 0.047031317, 0.024649212,
                                            0.037473913, -0.042430427, -0.04096348, 0.04707577,
                                            0.011352195, 0.013702651, 0.03276189, -0.011113261,
                                            -0.0007494505, -0.008496088, -0.023715697, 0.030183615,
                                            -0.0080737835, -0.029494593, 0.0051982277, 0.03889641,
                                            -0.0132914595, 0.0009098982, -0.054543883, 0.04216371,
                                            -0.028761119, -0.001066873, -0.050498657, -0.046364523,
                                            0.04956514, 0.06227871, 0.034273297, 0.019748263,
                                            0.05160998, -0.004887056, -0.0074458844, 0.008234926,
                                            0.013524838, 0.016014209, -0.0061067366, 0.003764617,
                                            -0.004603668, 0.009401819, -0.028338814, 0.04369734,
                                            -0.02331562, -0.009274016, -0.047964834, -0.00027036478,
                                            -0.010235313, 0.016414287, 0.014202747, -0.021970917,
                                            -0.07965985, 0.03507345, 0.024715891, -0.021904236,
                                            -0.0018836977, -0.04387515, -0.013358139, 0.019548224,
                                            0.018225746, -0.0467646, 0.0075514605, -0.029405687,
                                            -0.025004836, 0.030783731, 0.04934288, -0.021181874,
                                            -0.0212041, -0.030894864, 0.011402206, 0.055566303,
                                            -0.050632015, 0.011379979, -0.032184, 0.04623116,
                                            0.004928731, -0.005687211, -0.009262903, -0.0025421584,
                                        ]
                                    }
                                ],
                                currentKnowledgePointIndex: 1
                            }

                        } as IMessagesEndpointResponsePayload)
                    }, 1000);
                })

                let error = "";
                if (typeof nextState === "string") { error = nextState } else {
                    console.log("nextState: ", nextState)
                    const { newMessages, metadata } = nextState;
                    console.log("Setting lesson state to lessonstate.msgs and newMessages: ", newMessages)
                    setLessonState({ oldMessages: [...lessonState.oldMessages, ...lessonState.newMessages], newMessages, metadata });
                };
                return;
            }
            const theirReply = formData!.get("userInput") as string;
            if (!theirReply) {
                console.error("No user input found in form data");
                return null;
            };
            //if there is an explicit state, use it
            if (explicitState) {
                console.log("Setting lesson state to explicitState: ", explicitState)
                setLessonState({
                    oldMessages: [...lessonState.oldMessages, ...lessonState.newMessages, { content: theirReply, role: "user" }], newMessages: [...explicitState.newMessages],
                    metadata: explicitState.metadata
                });
                return;
            }
            //update state with their new reply
            const payload: IMessagesEndpointSendPayload = {
                messages: [...lessonState.oldMessages, ...lessonState.newMessages, { content: theirReply, role: "user" }],
                metadata
            }
            const nextState: IMessagesEndpointResponsePayload | string = await getNextMessage(payload);
            let error = "";
            if (typeof nextState === "string") { error = nextState } else {
                console.log("nextState: ", nextState)
                const { newMessages, metadata } = nextState;
                setLessonState({ oldMessages: [...lessonState.oldMessages, ...lessonState.newMessages], newMessages, metadata });
            };
        } catch (e) { console.error(e) }

    }
    console.log("knowledgePointChain (passing to neural network): ", knowledgePointChain)
    console.log("rendering LessonPage with oldmessages: ", oldMessages, " and metadata: ", metadata, " and currentSubject: ", currentSubject, " and knowledgePoints: ")
    console.dir(knowledgePointChain, { depth: null })
    return (<>
        <MainAreaNavbar style='lesson' />
        <div className='h-full flex flex-col bg-white' style={{ rowGap: spacing.gaps.groupedElement, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.padding.largest, paddingBottom: spacing.padding.largest }}>
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize) }}>{currentSubject || "New Question"}</h1>
            <NeuralNetwork knowledgePoints={knowledgePointChain} />
        </div>
        <ChatWithEli isOpen={true} type={lessonState.oldMessages.length > 0 ? 'Lesson' : 'NewQ'} lessonState={lessonState} updateState={updateState} />
    </>
    )
}