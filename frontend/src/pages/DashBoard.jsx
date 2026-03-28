import React from 'react'

import BusinessList from '../components/business/BusinessList'
import MapComponent from '../components/map/MapComponent'

function DashBoard() {
  return (
    <>
      <div className='flex flex-col lg:flex-row w-full h-[calc(100vh-124px)] relative'>
        
        {/* Left panel — full width on mobile, 45% on desktop */}
        <div className='w-full lg:w-[45%] h-[40%] lg:h-full overflow-y-auto 
                bg-white/70 z-10 relative shadow-xl'>
          <BusinessList/>
        </div>

        {/* Blur overlay — desktop only */}
        <div
          className='hidden lg:block absolute left-[43%] top-0 h-full w-24 
                backdrop-blur-lg z-20 pointer-events-none'
          style={{
            WebkitMaskImage: 'linear-gradient(to right, white 0%, white 40%, transparent 100%)',
            maskImage: 'linear-gradient(to right, white 0%, white 40%, transparent 100%)',
          }}
        />

        {/* Map — full width on mobile, 55% on desktop */}
        <div className='w-full lg:w-[55%] h-[60%] lg:h-full'>
          <MapComponent/>
        </div>

      </div>
    </>
  )
}

export default DashBoard